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

## 🔑 Authentication & Public Routes

This backend uses **JWT authentication** for protecting routes.  
I have also implemented **public access** for some routes, so that users can access them **without logging in**.  
This allows users to **register, login, browse products, categories, and view user count** without a token, while all other operations remain protected.

**Public/Open Routes Example:**

| URL | Methods | Description |
|-----|--------|-------------|
| `/api/v1/users/login` | POST | User login |
| `/api/v1/users` | POST, OPTIONS | User registration |
| `/api/v1/products` | GET, OPTIONS | Get all products |
| `/api/v1/products/:id` | GET, OPTIONS | Get single product |
| `/api/v1/categories` | GET, OPTIONS | Get all categories |
| `/api/v1/categories/:id` | GET, OPTIONS | Get single category |
| `/api/v1/users/get/count` | GET, OPTIONS | Get total user count (non-admin users) |
| `/public/uploads/*` | GET, OPTIONS | Access uploaded product images |

**Notes:**

- All other routes require authentication (`JWT`) and, in some cases, admin privileges (`adminOnly` middleware).  
- Public access is carefully limited to allow browsing and registration without compromising protected routes.


## ⚡ Installation

```bash
# Clone the repo
git clone <https://github.com/kareemtarekK/e-commerece.git>
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
