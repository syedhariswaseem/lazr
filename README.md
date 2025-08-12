# Lazr - Industrial Laser Cutting Machinery Application

A modern, full-stack e-commerce application built with **Next.js 15**, **TypeScript**, and **Stripe** for selling industrial laser cutting machinery. Features a complete shopping experience with dynamic cart management, secure payment processing, and beautiful UI/UX design.

## ✨ Key Features

### 🛒 **Shopping Experience**
- **Dynamic Cart System** - Real-time cart management with localStorage persistence
- **Product Catalog** - Filterable product listings with category navigation
- **Product Details** - Comprehensive product pages with specifications, features, and related products
- **Add to Cart** - Loading states, success toasts, and quantity indicators

### 💳 **Payment & Checkout**
- **Stripe Integration** - Secure payment processing with Payment Element
- **Checkout Flow** - Complete customer information collection and order processing
- **Order Confirmation** - Beautiful success page with order details and next steps
- **Webhook Handling** - Server-side payment event processing

### 🎨 **User Interface**
- **Modern Design** - Clean, professional UI with Tailwind CSS
- **Responsive Layout** - Mobile-first design that works on all devices
- **Interactive Elements** - Hover effects, animations, and smooth transitions
- **Toast Notifications** - Real-time feedback for user actions

### 🔧 **Technical Stack**
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Payment**: Stripe Checkout & Payment Element
- **State Management**: React Context API with useReducer
- **Database**: SQLite with Prisma (easily switchable to PostgreSQL/MySQL)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Stripe account

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/lazr-app.git
cd lazr-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Stripe keys to .env.local

# Run the development server
npm run dev
```

### Environment Variables
```env
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## 📱 Features Overview

### **Product Management**
- Product catalog with filtering
- Detailed product pages with specifications
- Related products suggestions
- Stock management and availability

### **Shopping Cart**
- Add/remove items with quantity controls
- Real-time cart updates
- Persistent cart state
- Cart count in navigation

### **Checkout Process**
- Customer information collection
- Secure Stripe payment processing
- Order confirmation and tracking
- Email notifications (webhook ready)

### **User Experience**
- Loading states and error handling
- Toast notifications for feedback
- Responsive design for all devices
- Smooth animations and transitions

## 🏗️ Architecture

### **Frontend Structure**
```
src/
├── app/                    # Next.js 15 app router
│   ├── products/          # Product catalog & details
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout flow
│   └── api/               # API routes
├── components/            # Reusable UI components
├── contexts/              # React context providers
└── lib/                   # Utility functions
```

### **Key Components**
- **CartContext** - Global cart state management
- **Toast System** - Notification system
- **Stripe Integration** - Payment processing
- **Product Components** - Catalog and detail views

## 🎯 Business Value

This application demonstrates a complete e-commerce solution suitable for:
- **Industrial Equipment Sales** - High-value machinery with complex specifications
- **B2B E-commerce** - Professional interface for business customers
- **Custom Product Catalogs** - Easily adaptable for different industries
- **Secure Payment Processing** - Enterprise-grade payment security

## 🔒 Security Features

- **Stripe Security** - PCI-compliant payment processing
- **Webhook Verification** - Secure server-side event handling
- **Input Validation** - Form validation and sanitization
- **Environment Variables** - Secure configuration management

## 🚀 Deployment Ready

The application is production-ready with:
- **Vercel Deployment** - Optimized for Next.js
- **Database Integration** - Prisma ORM with multiple database support
- **Environment Configuration** - Easy deployment setup
- **Performance Optimization** - Next.js 15 optimizations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments


- **Stripe** for secure payment processing
- **Next.js** for the amazing React framework
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide React** for beautiful icons

---

**Ready to revolutionize industrial equipment sales?** 🚀

This project showcases modern e-commerce development with enterprise-grade features, perfect for selling high-value industrial machinery with a professional, secure, and user-friendly experience.

## 📞 Contact

- **Website**: [lazr.com](https://lazr.vercel.app)
- **Email**: shharis81@gmail.com
