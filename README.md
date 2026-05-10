# 🛒 GreenCart – AI-Powered Online Grocery Store

GreenCart is a **full-stack MERN (MongoDB, Express, React, Node.js)** grocery app with an **AI cooking assistant** powered by Google Gemini. Customers can browse products, manage a shopping cart, save addresses, and place orders via **Cash on Delivery (COD)** or **Stripe Online Payments**. Sellers/Admins can manage products and view all orders.

👉 Live Demo: [greencart-sand.vercel.app](https://greencart-sand.vercel.app)

---

## ✨ Features

### 👤 User
- Register & login using JWT & cookies
- Browse categories and products with offers
- Add/remove items in the cart
- Save delivery addresses
- Checkout with:
  - **Cash on Delivery (COD)**
  - **Stripe Online Payment** (secure with webhook order updates)
- View order history and real-time payment status
- 🤖 **AI Cooking Assistant** — type any dish name and instantly get a full ingredients list powered by Google Gemini

### 🏪 Seller / Admin
- Secure login (email + password via environment variables)
- Add / edit / delete products (with images hosted on Cloudinary)
- View all customer orders with payment status

### 🤖 AI Assistant
- Built with **Google Gemini 2.5 Flash**
- Ask for ingredients of any dish (e.g. *"Butter Chicken"*, *"Pasta Carbonara"*)
- Returns a complete, structured list of raw ingredients instantly
- Accessible via the chat bubble on the storefront

---

## 🛠 Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React + Vite, Tailwind CSS                      |
| Backend    | Node.js, Express, JWT Auth                      |
| Database   | MongoDB Atlas with Mongoose ODM                 |
| AI         | Google Gemini 2.5 Flash via Generative AI SDK   |
| Storage    | Cloudinary for product images                   |
| Payments   | Stripe Checkout & Webhooks                      |
| Hosting    | Vercel (frontend + backend)                     |

