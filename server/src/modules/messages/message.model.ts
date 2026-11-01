import mongoose, { Schema, Document, Types } from "mongoose";

export interface MessageDocument extends Document {
  orderId: Types.ObjectId;
  senderType: "ADMIN" | "CUSTOMER" | "SYSTEM";
  senderName: string;
  senderEmail: string;
  message: string;
  emailStatus: "SENT" | "FAILED";
  createdAt: Date;
}

const messageSchema = new Schema<MessageDocument>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    senderType: { type: String, enum: ["ADMIN", "CUSTOMER", "SYSTEM"], required: true },
    senderName: { type: String, required: true },
    senderEmail: { type: String, required: true },
    message: { type: String, required: true },
    emailStatus: { type: String, enum: ["SENT", "FAILED"], default: "SENT" },
  },
  { timestamps: true }
);

export const Message = mongoose.model<MessageDocument>("Message", messageSchema);
