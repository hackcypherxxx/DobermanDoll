import crypto from "crypto";
import mongoose from "mongoose";
import { Order } from "./order.model.js";
import { Message } from "../messages/message.model.js";
import { Product } from "../products/product.model.js";
import { Coupon } from "../coupons/coupon.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { emailService } from "../../services/email.service.js";
import { receiptService } from "../../services/receipt.service.js";
import type { CreateOrderInput, PaymentInstructionsInput, ConfirmPaymentInput, ShipOrderInput } from "./order.schema.js";

const generateOrderNumber = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const count = await Order.countDocuments();
  return `RD-${year}-${String(count + 1).padStart(6, "0")}`;
};

export const orderService = {
  async createGuestOrder(data: CreateOrderInput) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      let subtotal = 0;
      const orderItems = [];
      for (const item of data.items) {
        const product = await Product.findById(item.productId).session(session);
        if (!product) throw new ApiError(404, `Product not found: ${item.productId}`);
        if (!product.isPublished) throw new ApiError(400, `Product unavailable: ${product.name}`);
        if (product.inventoryType === "IN_STOCK" && product.stock < item.quantity) {
          throw new ApiError(400, `Insufficient stock for ${product.name}`);
        }
        const lineTotal = product.price * item.quantity;
        subtotal += lineTotal;
        orderItems.push({ productId: product._id, name: product.name, slug: product.slug, image: product.images[0]?.url || "", sku: product.sku, quantity: item.quantity, unitPrice: product.price, lineTotal });
        if (product.inventoryType === "IN_STOCK") {
          product.stock -= item.quantity;
          await product.save({ session });
        }
      }

      // Coupon Logic
      let discount = 0;
      if (data.couponCode) {
        const coupon = await Coupon.findOne({ code: data.couponCode.toUpperCase(), isActive: true }).session(session);
        if (!coupon) throw new ApiError(400, "Invalid coupon code");
        if (coupon.uses >= coupon.maxUses) throw new ApiError(400, "Coupon usage limit reached");
        if (new Date() > coupon.expiresAt) throw new ApiError(400, "Coupon has expired");
        if (subtotal < coupon.minPurchaseAmount) throw new ApiError(400, `Minimum spend for this coupon is $${coupon.minPurchaseAmount}`);

        if (coupon.discountType === "PERCENTAGE") {
          discount = (subtotal * coupon.discountValue) / 100;
        } else {
          discount = coupon.discountValue;
        }
        if (discount > subtotal) discount = subtotal;

        coupon.uses += 1;
        await coupon.save({ session });
      }

      const discountedSubtotal = subtotal - discount;
      const shippingFee = discountedSubtotal > 200 ? 0 : 15;
      const total = discountedSubtotal + shippingFee;
      
      const trackingToken = crypto.randomBytes(32).toString("hex");
      const order = new Order({
        orderNumber: await generateOrderNumber(), 
        customer: data.customer, 
        shippingAddress: data.shippingAddress,
        items: orderItems, 
        subtotal, 
        discount, 
        shippingFee, 
        total, 
        orderStatus: "PENDING", 
        paymentStatus: "UNPAID",
        preferredPaymentMethod: data.preferredPaymentMethod, // <--- ADDED
        customerNotes: data.customerNotes,
        trackingTokenHash: crypto.createHash("sha256").update(trackingToken).digest("hex"),
        trackingTokenExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
      await order.save({ session });
      await session.commitTransaction();

      Promise.all([emailService.sendOrderConfirmation(order), emailService.sendAdminOrderNotification(order)])
        .then(async (results) => {
          for (const res of results) order.emailHistory.push({ type: "ORDER_CONFIRMATION", sentAt: new Date(), status: res.success ? "SENT" : "FAILED" });
          await order.save();
        }).catch(console.error);

      return { order, trackingToken };
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  },

  async getAllAdmin() { return Order.find().sort({ createdAt: -1 }); },
  async getByIdAdmin(id: string) {
    const order = await Order.findById(id);
    if (!order) throw new ApiError(404, "Order not found");
    return order;
  },
  async trackByToken(token: string) {
    const hash = crypto.createHash("sha256").update(token).digest("hex");
    const order = await Order.findOne({ trackingTokenHash: hash, trackingTokenExpiresAt: { $gt: new Date() } });
    if (!order) throw new ApiError(404, "Invalid tracking link");
    return { orderNumber: order.orderNumber, orderStatus: order.orderStatus, paymentStatus: order.paymentStatus, items: order.items, total: order.total, shippingDetails: order.shippingDetails };
  },

  async sendPaymentInstructions(id: string, data: PaymentInstructionsInput) {
    const order = await Order.findById(id);
    if (!order) throw new ApiError(404, "Order not found");
    if (order.paymentStatus === "PAID") throw new ApiError(400, "Already paid");
    Object.assign(order, { ...data, paymentStatus: "INSTRUCTIONS_SENT", orderStatus: "AWAITING_PAYMENT" });
    await order.save();
    emailService.sendPaymentInstructions(order).then(async (res) => {
      order.emailHistory.push({ type: "PAYMENT_INSTRUCTIONS", sentAt: new Date(), status: res.success ? "SENT" : "FAILED" });
      await order.save();
    }).catch(console.error);
    return order;
  },

  async confirmPayment(id: string, adminId: string, data: ConfirmPaymentInput) {
    const order = await Order.findById(id);
    if (!order) throw new ApiError(404, "Order not found");
    if (order.paymentStatus === "PAID") throw new ApiError(400, "Already paid");
    order.paymentStatus = "PAID";
    order.orderStatus = "PROCESSING";
    if (data.paymentReference !== undefined) order.paymentReference = data.paymentReference;
    order.paymentConfirmedAt = new Date();
    order.paymentConfirmedBy = new mongoose.Types.ObjectId(adminId);
    order.receipt = { receiptNumber: `REC-${order.orderNumber}`, generatedAt: new Date() };
    const pdfBuffer = await receiptService.generateReceiptPdf(order);
    await order.save();
    emailService.sendPaymentReceipt(order, pdfBuffer).then(async (res) => {
      order.emailHistory.push({ type: "PAYMENT_RECEIPT", sentAt: new Date(), status: res.success ? "SENT" : "FAILED" });
      await order.save();
    }).catch(console.error);
    return order;
  },

  async shipOrder(id: string, data: ShipOrderInput) {
    const order = await Order.findById(id);
    if (!order) throw new ApiError(404, "Order not found");
    if (order.orderStatus !== "PROCESSING") throw new ApiError(400, "Order must be PROCESSING to ship");
    order.orderStatus = "SHIPPED";
    order.shippingDetails = { carrier: data.carrier, trackingNumber: data.trackingNumber, ...(data.trackingUrl !== undefined ? { trackingUrl: data.trackingUrl } : {}), shippedAt: new Date() };
    await order.save();
    emailService.sendEmail(order.customer.email, `Your order ${order.orderNumber} has shipped!`, `<h1>Good news!</h1><p>Your order has been shipped via ${data.carrier}. Tracking: ${data.trackingNumber}</p>`).catch(console.error);
    return order;
  },

  async deliverOrder(id: string) {
    const order = await Order.findById(id);
    if (!order) throw new ApiError(404, "Order not found");
    if (order.orderStatus !== "SHIPPED") throw new ApiError(400, "Order must be SHIPPED to deliver");
    order.orderStatus = "DELIVERED";
    await order.save();
    emailService.sendEmail(order.customer.email, `Your order ${order.orderNumber} has been delivered!`, `<h1>Delivered!</h1><p>We hope you love your new doll.</p>`).catch(console.error);
    return order;
  },

  async resendReceipt(id: string) {
    const order = await Order.findById(id);
    if (!order) throw new ApiError(404, "Order not found");
    if (order.paymentStatus !== "PAID") throw new ApiError(400, "Order is not paid");
    const pdfBuffer = await receiptService.generateReceiptPdf(order);
    const result = await emailService.sendPaymentReceipt(order, pdfBuffer);
    order.emailHistory.push({ type: "PAYMENT_RECEIPT_RETRY", sentAt: new Date(), status: result.success ? "SENT" : "FAILED" });
    await order.save();
    if (!result.success) throw new ApiError(500, "Failed to resend receipt email");
    return order;
  },

  async sendCustomMessage(id: string, adminName: string, messageBody: string) {
    const order = await Order.findById(id);
    if (!order) throw new ApiError(404, "Order not found");
    const message = await Message.create({ orderId: order._id, senderType: "ADMIN", senderName: adminName, senderEmail: "admin@dreambabynursery.com", message: messageBody, emailStatus: "SENT" });
    const result = await emailService.sendCustomAdminMessage(order, messageBody);
    if (!result.success) {
      message.emailStatus = "FAILED";
      await message.save();
      throw new ApiError(500, "Failed to send email");
    }
    return message;
  }
};
