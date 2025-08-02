# SEO-Optimized E-commerce Frontend

This project is a professional, modern, SEO-optimized e-commerce frontend built with **Next.js (App Router)**, **Redux Toolkit**, **Tailwind CSS**, and **TypeScript**. It demonstrates a complete e-commerce flow including product showcase, dynamic routing, a checkout experience, and order management — all without a backend.

---

## Live Demo - [(https://e-commerce-shop-ozeh.vercel.app/)]

## Features

### Pages & Functionalities

1. **Home Page** (`/`)
   - A responsive and modern Banner
   - Fetches product list from [Fake Store API](https://fakestoreapi.com/products)
   - Responsive grid with product cards (title, price, image)
   - "View Details" navigates to individual product
Features Overview

1. **Displays product list in a responsive grid with**
    - Product Thumbnail,Title, Price
    -View Details button (links to the product page)
    -Add to Cart Button

2. **Product Page**
    Displays complete product details on a dedicated page.
    Features an “Add to Cart” button.
    Built using getStaticPaths and getStaticProps for optimized static generation.
**SEO Friendly*
    - Dynamically sets <title> and <meta description> using generateMetadata.
    - Product Filtering & Search
    - Filter by:
        . Category
        . Price Range
        . (Optional) Size
        . Search products by name

1. **Cart & Checkout**
 using Redux
. Add/remove products to/from cart

1. **Checkout page includes form with real-time validation for**
    - Full Name
    - Shipping Address
    - Phone Number
2. **On successful checkout*
    - Stores order in Redux
    -Redirects to a Thank You page

3. **Order List Page**
Route: /orders
Lists all orders placed by the user

-Each order displays:
    . Order ID (Clickable Order ID navigates to Order Details Page)
    . Customer Name
    . Total Items
    . Total Amount
    . Order Date
8. **Order Placement & Thank You Page**
    After a successful order
  - Redirects user to /thank-you

1. Order Details Page
Route: /order/[id]
Displays full order information:
. Customer Name
. Shipping Address
. Phone Number
. Ordered Products (with quantity & price)
. Subtotal, Tax, and Total
. Order ID and Date
. in below invoice button

PDF Invoice Support
Includes a “View Invoice” button

Generates a downloadable PDF invoice using html2pdf.js or jsPDF

## Tech Stack

- **Next.js** (App Router + SSG)
- **Redux Toolkit** (for cart and order state)
- **Tailwind CSS** (for UI styling)
- **TypeScript** (type safety across the app)

---

## SEO Optimization

- Dynamic `<title>` and `<meta description>` using `next/head`
- Semantic HTML tags: `<main>`, `<section>`,
- `robots.txt` and `sitemap.xml` included in `/public`
- Clean, crawlable URLs (`/product/1`, `/orders`)
- Images include `alt` attributes for accessibility and SEO
- Optimized with `next/image` (with `alt` and priority where needed)

## Getting Started

### 1. Clone the Repository

- git clone https://github.com/kutub98/E-commerce-shop
- cd E-commerce-shop