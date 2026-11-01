import { resend } from "../config/resend.js";
import { env } from "../config/env.js";
import type { OrderDocument } from "../modules/orders/order.model.js";

const emailWrapper = (title: string, content: string) => `
  <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; color: #333333;">
    
    <!-- Header -->
    <div style="text-align: center; padding: 30px 20px; background-color: #6b2137; color: #ffffff;">
      <h1 style="margin: 0; font-size: 28px; font-weight: normal; letter-spacing: 2px;">DreamBaby</h1>
      <p style="margin: 5px 0 0 0; font-size: 11px; letter-spacing: 3px; text-transform: uppercase;">Silicone Nursery</p>
    </div>

    <!-- Body -->
    <div style="padding: 40px 30px;">
      <h2 style="color: #6b2137; font-size: 20px; font-weight: normal; margin-top: 0;">${title}</h2>
      <div style="font-size: 15px; line-height: 1.6; color: #444444;">
        ${content}
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 20px; background-color: #f9f6f7; font-size: 12px; color: #888888;">
      <p style="margin: 0 0 5px 0;">Discover your little treasure — explore our collection.</p>
      <p style="margin: 0;">&copy; ${new Date().getFullYear()} DreamBaby Silicone Nursery. All rights reserved.</p>
    </div>
  </div>
`;

export const emailService = {
  async sendEmail(to: string, subject: string, html: string, attachments?: any[]) {
    try {
      const data = await resend.emails.send({
        from: `DreamBaby Nursery <${env.RESEND_FROM_EMAIL}>`,
        to,
        subject,
        html,
        ...(attachments ? { attachments } : {}),
      });
      return { success: true, id: data.data?.id };
    } catch (error: any) {
      console.error("Resend API Error:", error.message);
      return { success: false, error: error.message };
    }
  },

  async sendOrderConfirmation(order: OrderDocument) {
    const content = `
      <p>Thank you for your order, <strong>${order.customer.name}</strong>!</p>
      <p>Your order <strong>${order.orderNumber}</strong> has been received and is being carefully reviewed by our nursery.</p>
      <p><strong>Total Amount:</strong> $${order.total.toFixed(2)}</p>
      <p>We will send you an email shortly with payment instructions.</p>
    `;
    return this.sendEmail(order.customer.email, `Order Confirmation: ${order.orderNumber}`, emailWrapper("Order Confirmed", content));
  },

  async sendAdminOrderNotification(order: OrderDocument) {
    const content = `
      <p><strong>Order:</strong> ${order.orderNumber}</p>
      <p><strong>Customer:</strong> ${order.customer.name} (${order.customer.email})</p>
      <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
      <p>Log in to your admin dashboard to review and send payment instructions.</p>
    `;
    return this.sendEmail(env.ADMIN_NOTIFICATION_EMAIL, `New Order: ${order.orderNumber}`, emailWrapper("New Order Received", content));
  },

  async sendPaymentInstructions(order: OrderDocument) {
    const content = `
      <p>Thank you for choosing DreamBaby!</p>
      <p>Please pay <strong>$${order.total.toFixed(2)}</strong> using the following method:</p>
      <div style="background: #fcfafb; padding: 15px; border-left: 4px solid #6b2137; margin: 20px 0;">
        <p style="margin-top: 0;"><strong>${order.paymentMethod}</strong></p>
        <p style="margin-bottom: 0;">${order.paymentInstructions}</p>
      </div>
      <p>Once paid, please reply to this email with your receipt or transaction reference.</p>
    `;
    return this.sendEmail(order.customer.email, `Payment Instructions: ${order.orderNumber}`, emailWrapper("Payment Instructions", content));
  },

  async sendPaymentReceipt(order: OrderDocument, pdfBuffer: Buffer) {
    const content = `
      <p>Thank you! Your payment for order <strong>${order.orderNumber}</strong> has been confirmed.</p>
      <p><strong>Total Paid:</strong> $${order.total.toFixed(2)}</p>
      <p>Your reborn baby is now being prepared. Please find your official PDF receipt attached.</p>
    `;
    return this.sendEmail(order.customer.email, `Receipt for ${order.orderNumber}`, emailWrapper("Payment Confirmed", content), [
      {
        filename: `DreamBaby-Receipt-${order.orderNumber}.pdf`,
        content: pdfBuffer,
      },
    ]);
  },

  async sendCustomAdminMessage(order: OrderDocument, messageBody: string) {
    const content = `
      <p>${messageBody.replace(/\n/g, "<br/>")}</p>
      <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 30px 0;" />
      <p style="font-size: 13px; color: #888888;">Regarding Order: <strong>${order.orderNumber}</strong></p>
    `;
    return this.sendEmail(order.customer.email, `Update on your order: ${order.orderNumber}`, emailWrapper("A message from DreamBaby", content));
  }
};
