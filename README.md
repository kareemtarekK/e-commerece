# E-Commerce Backend

## 📄 Project Description
This is a **Node.js + Express + MongoDB backend** for an E-Commerce platform.  
It supports:

- User registration & login with JWT authentication
- Admin-only routes for managing users, products, orders, and categories
- CRUD operations for Users, Products, Orders, Categories
- File uploads for product images via Multer
- Serving uploaded files securely with `express.static`
- Order aggregation (sales, featured products)
- Filtering, sorting, and nested population for products and orders

---

## ⚡ Installation

```bash
# Clone the repo
git clone <e-commerece>
cd your-project

# Install dependencies
npm install

# Create .env file
# Example:
# PORT=3000
# MONGO_URI=mongodb://localhost:27017/ecommerce
# SECRET=your_jwt_secret
# EXPIRESIN=1d

# Start server
npm run dev
