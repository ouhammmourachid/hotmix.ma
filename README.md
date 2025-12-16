# Hotmix.ma Store

A modern e-commerce web application built with [Next.js 16](https://nextjs.org/), [TypeScript](https://www.typescriptlang.org/), and [Tailwind CSS](https://tailwindcss.com/). This project features a dynamic shopping experience with [PocketBase](https://pocketbase.io/) as the backend.

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Radix UI Primitives, Framer Motion
- **Backend:** PocketBase (Authentication, Database, Realtime)
- **Icons:** Lucide React
- **Internationalization:** next-intl

## ✨ Features

- **Dynamic Product Catalog:** Browse collections and products with real-time data from PocketBase.
- **Rich Product Details:** Detailed views with image galleries, variants, and recommendations.
- **Shopping Cart & Wishlist:** Seamless cart management and wishlist functionality.
- **User Authentication:** Secure login and registration flows (OTP support).
- **Responsive Design:** Optimized for all devices using Tailwind CSS and mobile-first principles.
- **Smooth Animations:** Enhanced user experience with Framer Motion transitions.

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- A running instance of [PocketBase](https://pocketbase.io/) with the appropriate schema.

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd hotmix.ma
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Configure Environment Variables:**

   Create a `.env.local` file in the root directory. You typically need to configure your PocketBase URL:

   ```env
   NEXT_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📜 Scripts

- `npm run dev`: Starts the development server with Turbopack.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint to check for code quality.

## 📂 Project Structure

Key directories in `src/`:

- `app`: Next.js App Router pages and layouts.
- `components`: Reusable UI components, including Shadcn/Radix primitives and feature-specific components.
- `lib` / `utils`: Utility functions and helpers.
- `hooks`: Custom React hooks.
