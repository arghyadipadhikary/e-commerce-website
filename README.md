# 🛍️ ShopHub - Full Stack E-commerce Platform

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=nextdotjs&style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript&style=for-the-badge)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black&style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&style=for-the-badge)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel&style=for-the-badge)

---

## 📦 Overview

**ShopHub** is a modern, full-stack e-commerce platform built using **Next.js 14**, **TypeScript**, and **Firebase**. It offers a seamless and secure shopping experience with robust features like product management, user authentication, admin dashboard, and real-time updates.

---

## 🚀 Features

- 🔐 User Authentication with Firebase Auth
- 🛒 Shopping Cart & Wishlist
- 🗂️ Product Catalog with Search & Filtering
- 📦 Admin Dashboard for Product/Order Management
- 🌐 Responsive & Accessible UI
- 📝 Product Reviews and Ratings
- 💳 Stripe Payment Integration
- 🔄 Real-time Firestore Updates

---

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 14** – App Router, SSR, SEO optimized
- **TypeScript** – Type safety and scalability
- **Tailwind CSS** – Utility-first styling
- **shadcn/ui** – Modern, accessible UI components
- **React Context API** – State management

### **Backend & Services**
- **Firebase Firestore** – NoSQL real-time DB
- **Firebase Authentication** – Secure auth with providers
- **Firebase Storage** – Image uploads
- **Stripe** – Secure and PCI-compliant payments
- **Vercel** – Seamless deployment and CI/CD

---

## 📐 Architecture

- Modular component-based structure
- Multiple Context Providers (Auth, Cart, Wishlist)
- Custom Hooks for State Access
- SSR & Client-side hydration guards
- Lazy Loading & Code Splitting

---

## 🧪 Testing Strategy

- ✅ Unit Testing (Jest + RTL)
- 🔗 Integration Testing (API endpoints)
- 🧭 E2E Testing (Planned with Playwright)
- 🧪 Manual Testing (Cross-browser/device)

---

## 📈 Performance

- Lighthouse Scores:
  - **Performance:** 92
  - **Accessibility:** 98
  - **Best Practices:** 100
  - **SEO:** 95

- Core Web Vitals:
  - **FCP:** 1.2s
  - **LCP:** 2.1s
  - **CLS:** 0.05
  - **FID:** 45ms

---

## 🔒 Security Highlights

- 🔑 Firebase Auth + RBAC
- 🔐 Protected API Routes
- 🛡️ Firestore Security Rules
- 💳 PCI-DSS Compliant Stripe Integration
- ❌ XSS/CSRF Protection (via Next.js)

---

## 📚 Lessons Learned

- React Context API is powerful but can scale poorly for large apps (consider Zustand/Redux).
- Firebase read operations can get expensive – monitor usage closely.
- TypeScript significantly boosts confidence and maintainability.
- Incremental feature development helps in better debugging and testing.

---

## 📷 Screenshots

<img width="1003" height="455" alt="image" src="https://github.com/user-attachments/assets/ddcdb276-9de0-4ac4-aaa0-ce59145e556c" />

<img width="1004" height="655" alt="image" src="https://github.com/user-attachments/assets/ad57ed23-39a1-40a6-be7b-c4de89e70965" />

<img width="1004" height="786" alt="image" src="https://github.com/user-attachments/assets/ed5e6dd4-9d57-4e33-b993-9b069d05ce3e" />

