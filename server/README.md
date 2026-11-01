cat > README.md << 'EOF'
# Reborn Doll E-Commerce Backend

A production-ready REST API for a premium reborn baby doll e-commerce platform. 

## Tech Stack
- **Node.js / TypeScript** (ESM, strict mode)
- **Express.js 5**
- **MongoDB / Mongoose**
- **Zod** (runtime validation)
- **Resend** (transactional email)
- **Cloudinary** (image storage)
- **PDFKit** (receipt generation)
- **Vitest / Supertest** (testing)

## Features
- **Guest Checkout**: Customers can browse and purchase without an account.
- **Admin Auth**: JWT-based login with HTTP-only cookies (no public registration).
- **Manual Payments**: Admin sends payment instructions, customer pays, admin confirms.
- **Automated Receipts**: PDF receipt generated and emailed upon payment confirmation.
- **Order Tracking**: Secure, tokenized tracking links for customers.
- **Inventory Management**: MongoDB transactions prevent overselling.
- **Admin Dashboard**: Real-time stats for revenue, orders, and products.

## Setup Instructions

### 1. Prerequisites
- Node.js (v20+)
- MongoDB (local or Atlas)

### 2. Installation
```bash
npm install