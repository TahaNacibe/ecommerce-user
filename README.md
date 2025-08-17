# E-commerce Platform - Client

A modern e-commerce client application providing customers with a seamless shopping experience, featuring secure authentication and integrated payment processing.

## Features

- **Product Catalog** - Browse products with detailed pages and image galleries
- **Category Navigation** - Filter products by organized categories
- **Smart Search** - Find products with advanced search and filtering
- **Shopping Cart** - Add, modify, and manage items before purchase
- **Secure Checkout** - Complete purchases with Stripe payment integration
- **User Authentication** - Secure registration and login with role-based access
- **Order History** - Track past purchases and order status
- **Responsive Design** - Optimized experience across all devices

## Security Features

- **JWT Authentication** - Secure token-based user sessions
- **Role-based Authorization** - Protected routes based on user permissions
- **Secure API Communication** - Encrypted data transmission
- **Payment Security** - PCI-compliant Stripe integration
- **Input Validation** - Client-side and server-side data validation

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **State Management**: Redux Toolkit
- **Authentication**: JWT with role-based access control
- **Payments**: Stripe API integration
- **HTTP Client**: Axios with interceptors
- **Routing**: React Router with protected routes

## Setup

```bash
# Clone and install
git clone https://github.com/yourusername/ecommerce-client.git
cd ecommerce-client
npm install

# Environment setup
cp .env.example .env
# Add your API endpoints and Stripe public key

# Start development server
npm run dev
```

## API Integration

The client communicates with the backend API for:
- User authentication and authorization
- Product data and search
- Cart management
- Order processing
- Payment handling through Stripe

---

*A portfolio project demonstrating modern React development with secure authentication, payment integration, and responsive design.*