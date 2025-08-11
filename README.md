# Precision Laser Cutting Machinery Application

A modern, sleek web application for a laser cutting machinery company built with Next.js, TypeScript, Tailwind CSS, and Prisma.

## Features

### 🏠 **Homepage**
- Hero section with compelling call-to-action
- Feature highlights showcasing laser cutting capabilities
- Modern design with black and gray color scheme
- Responsive layout for all devices

### 📦 **Products Page**
- Grid layout displaying laser cutting machinery
- Product categories and filtering
- Product details with pricing and stock information
- Add to cart functionality
- Star ratings and product images

### 🛒 **Shopping Cart**
- Interactive cart with quantity controls
- Real-time price calculations
- Remove items functionality
- Order summary with tax calculations
- Empty cart state with call-to-action

### 📄 **About Page**
- Company story and mission
- Team member profiles
- Statistics and achievements
- Company values and culture

### 📞 **Contact Page**
- Contact form with validation
- Company information and business hours
- Interactive map placeholder
- Multiple contact methods

### 🔧 **Backend Features**
- SQLite database with Prisma ORM
- RESTful API endpoints
- Product management
- Cart functionality
- User authentication ready

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Icons**: Lucide React
- **Authentication**: JWT (ready for implementation)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd laser-cutting-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your configuration:
   ```
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Seed the database with sample data**
   ```bash
   npm run seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
laser-cutting-app/
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── about/         # About page
│   │   ├── cart/          # Cart page
│   │   ├── contact/       # Contact page
│   │   ├── products/      # Products page
│   │   ├── globals.css    # Global styles
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Homepage
│   ├── components/        # Reusable components
│   └── lib/              # Utility functions
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts           # Database seeder
├── public/               # Static assets
└── package.json
```

## Database Schema

The application uses the following database models:

- **User**: User accounts and authentication
- **Product**: Laser cutting machinery products
- **CartItem**: Shopping cart items
- **Order**: Customer orders
- **OrderItem**: Individual items in orders

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product

### Cart
- `GET /api/cart?userId=<id>` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart` - Update cart item quantity
- `DELETE /api/cart?id=<id>` - Remove item from cart

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with sample data

## Design Features

### Color Scheme
- **Primary**: Black (#000000)
- **Secondary**: Gray shades (#1f2937, #374151, #6b7280)
- **Accent**: Red (#dc2626) for call-to-actions
- **Background**: Light gray (#f9fafb)

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: Regular, Medium, Semibold, Bold

### Components
- Responsive navigation with mobile menu
- Modern card layouts
- Interactive buttons and forms
- Loading states and animations

## Future Enhancements

- [ ] User authentication and registration
- [ ] Admin dashboard for product management
- [ ] Payment integration (Stripe)
- [ ] Order tracking system
- [ ] Customer reviews and ratings
- [ ] Advanced product filtering
- [ ] Wishlist functionality
- [ ] Email notifications
- [ ] Multi-language support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact:
- Email: shharis81@gmail.com
- Phone: +92 320 4577866

---

Built with ❤️ using Next.js and modern web technologies.
