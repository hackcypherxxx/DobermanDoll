import PDFDocument from "pdfkit";
import type { OrderDocument } from "../modules/orders/order.model.js";

export const receiptService = {
  async generateReceiptPdf(order: OrderDocument): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", (err) => reject(err));

      // Header Background
      doc.rect(0, 0, 612, 100).fill("#6b2137");

      // Header Text
      doc.fillColor("#ffffff").fontSize(28).font("Helvetica-Bold").text("DreamBaby", 0, 35, { align: "center" });
      doc.fontSize(10).font("Helvetica").text("SILICONE NURSERY", 0, 70, { align: "center", characterSpacing: 2 });
      
      // Reset to black text
      doc.fillColor("#333333");
      doc.moveDown(5);

      // Receipt Title
      doc.fontSize(18).font("Helvetica-Bold").text("PAYMENT RECEIPT", { align: "center" });
      doc.moveDown(1);

      // Order Details
      doc.fontSize(11).font("Helvetica");
      doc.text(`Receipt Number: REC-${order.orderNumber}`);
      doc.text(`Order Number: ${order.orderNumber}`);
      doc.text(`Date: ${new Date().toLocaleDateString()}`);
      doc.moveDown();

      // Customer Details
      doc.text(`Billed To: ${order.customer.name}`);
      doc.text(`Email: ${order.customer.email}`);
      doc.moveDown(2);

      // Table Header
      const tableTop = doc.y;
      doc.rect(50, tableTop - 10, 512, 25).fill("#f9f6f7");
      doc.fillColor("#6b2137").font("Helvetica-Bold");
      doc.text("Item", 60, tableTop);
      doc.text("Qty", 320, tableTop);
      doc.text("Price", 380, tableTop);
      doc.text("Total", 470, tableTop);
      
      // Table Body
      doc.fillColor("#333333").font("Helvetica");
      let y = tableTop + 25;
      for (const item of order.items) {
        doc.text(item.name, 60, y);
        doc.text(String(item.quantity), 320, y);
        doc.text(`$${item.unitPrice.toFixed(2)}`, 380, y);
        doc.text(`$${item.lineTotal.toFixed(2)}`, 470, y);
        y += 25;
      }

      doc.moveTo(50, y).lineTo(562, y).stroke("#eeeeee");
      y += 15;

      // Totals
      doc.text(`Subtotal:`, 380, y);
      doc.text(`$${order.subtotal.toFixed(2)}`, 470, y);
      y += 20;
      doc.text(`Shipping:`, 380, y);
      doc.text(`$${order.shippingFee.toFixed(2)}`, 470, y);
      y += 20;
      
      // Total Paid Highlight
      doc.font("Helvetica-Bold").fontSize(12);
      doc.text(`Total Paid:`, 380, y);
      doc.text(`$${order.total.toFixed(2)}`, 470, y);

      // Payment Info
      doc.font("Helvetica").fontSize(11);
      doc.moveDown(3);
      doc.text(`Payment Method: ${order.paymentMethod || "N/A"}`);
      doc.text(`Payment Reference: ${order.paymentReference || "N/A"}`);
      doc.text(`Status: PAID`);

      // Footer
      doc.fontSize(9).fillColor("#888888").text("Thank you for choosing DreamBaby Silicone Nursery.", 50, 700, { align: "center", width: 512 });

      doc.end();
    });
  }
};
