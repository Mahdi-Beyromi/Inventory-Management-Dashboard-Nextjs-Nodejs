# 📊 Inventory Management Dashboard

A modern, full-stack inventory management system built with Next.js, Express.js, and PostgreSQL. This application provides a comprehensive solution for managing products, tracking inventory levels, and monitoring business metrics through an intuitive dashboard interface.

## ✨ Features

### 🎯 Core Functionality
- **Product Management**: Add, edit, and delete products with detailed information
- **Inventory Tracking**: Real-time stock quantity monitoring
- **Dashboard Analytics**: Visual representation of inventory metrics and popular products
- **User Management**: Secure user authentication and role-based access
- **Responsive Design**: Modern UI that works seamlessly across all devices

### 🛠️ Technical Features
- **Real-time Updates**: Live data synchronization between frontend and backend
- **Data Visualization**: Interactive charts and graphs using Recharts
- **State Management**: Redux Toolkit with Redux Persist for robust state handling
- **Type Safety**: Full TypeScript implementation for better code quality
- **Database Management**: Prisma ORM with PostgreSQL for reliable data storage

## 🏗️ Architecture

This project follows a modern full-stack architecture with clear separation of concerns:

```
├── client/                 # Frontend (Next.js 15 + React 19)
│   ├── src/
│   │   ├── app/           # App Router components
│   │   ├── state/         # Redux store and slices
│   │   └── components/    # Reusable UI components
│   └── public/            # Static assets
├── server/                 # Backend (Express.js + TypeScript)
│   ├── src/
│   │   ├── controllers/   # Business logic handlers
│   │   ├── routes/        # API endpoint definitions
│   │   └── index.ts       # Server entry point
│   └── prisma/            # Database schema and migrations
└── README.md              # This file
```

## 🚀 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Material-UI (MUI)** - React component library
- **Redux Toolkit** - State management
- **Recharts** - Chart library for data visualization

### Backend
- **Express.js 5** - Fast, unopinionated web framework
- **TypeScript** - Type-safe Node.js development
- **Prisma** - Modern database ORM
- **PostgreSQL** - Reliable relational database
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** database
- **Git**

## 🛠️ Installation & Setup

### 🐳 Option 1: Docker (Recommended)

The easiest way to run the entire project:

```bash
# Clone the repository
git clone <your-repository-url>
cd inventory-management-dashboard

# Start all services with Docker
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Access your application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Database: localhost:5432

For detailed Docker setup instructions, see [DOCKER_SETUP.md](./DOCKER_SETUP.md).

**🚨 Having Docker issues on Windows?** Check [DOCKER_TROUBLESHOOTING_WINDOWS.md](./DOCKER_TROUBLESHOOTING_WINDOWS.md) for common solutions.

**📦 New Orders Feature!** Check [ORDERS_FEATURE.md](./ORDERS_FEATURE.md) for complete documentation.

### 🔧 Option 2: Manual Setup

#### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd inventory-management-dashboard
```

#### 2. Backend Setup
```bash
cd server
npm install

# Create .env file
cp env.example .env
# Edit .env with your database credentials

# Database setup
npx prisma generate
npx prisma db push
npm run seed

# Start development server
npm run dev
```

#### 3. Frontend Setup
```bash
cd client
npm install

# Create .env.local file
cp env.example .env.local
# Edit .env.local with your backend API URL

# Start development server
npm run dev
```

## 🔧 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/inventory_db"
PORT=3001
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🗄️ Database Schema

The application uses the following main entities:

### Users
- `userId` (String, Primary Key)
- `name` (String)
- `email` (String)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Products
- `productId` (String, Primary Key)
- `name` (String)
- `price` (Float)
- `rating` (Float, Optional)
- `stockQuantity` (Integer)
- `category` (String)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

## 🚀 Available Scripts

### Backend
```bash
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm run start    # Start production server
npm run seed     # Seed database with sample data
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 📱 API Endpoints

### Dashboard
- `GET /dashboard` - Get dashboard analytics and metrics

### Products
- `GET /products` - Get all products
- `POST /products` - Create new product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Orders
- `GET /orders` - Get all orders with product details
- `POST /orders` - Create new order (automatically decreases stock)

## 🎨 UI Components

The application includes several key components:

- **Dashboard Cards**: Display key metrics and popular products
- **Product Table**: Sortable and searchable product listing
- **Create/Edit Modals**: Forms for product management
- **Order Management**: Complete order creation and tracking system
- **Navigation**: Responsive navigation with mobile support
- **Charts**: Interactive data visualizations

## 🔒 Security Features

- **Helmet.js**: Security headers and protection
- **CORS**: Controlled cross-origin access
- **Input Validation**: Server-side data validation
- **SQL Injection Protection**: Prisma ORM prevents SQL attacks

## 📊 Data Visualization

The dashboard includes various charts and visualizations:

- **Popular Products Chart**: Top-performing products
- **Inventory Levels**: Stock quantity overview
- **Category Distribution**: Product category breakdown
- **Price Range Analysis**: Product pricing insights

## 🧪 Testing

```bash
# Backend testing
cd server
npm test

# Frontend testing
cd client
npm test
```

## 📦 Deployment

### Backend Deployment
1. Build the application: `npm run build`
2. Set production environment variables
3. Deploy to your preferred hosting service (Heroku, AWS, etc.)

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or your preferred hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed description
3. Contact the development team

## 🔮 Future Enhancements

- [ ] Real-time notifications
- [ ] Advanced reporting and analytics
- [ ] Multi-warehouse support
- [ ] Barcode scanning integration
- [ ] Mobile app development
- [ ] Advanced user roles and permissions
- [ ] API rate limiting
- [ ] Webhook integrations

## 📊 Performance Metrics

- **Frontend**: Optimized with Next.js 15 and React 19
- **Backend**: Express.js with optimized database queries
- **Database**: PostgreSQL with Prisma ORM for efficient data access
- **Caching**: Redux state management with persistence

---

**Built with ❤️ using modern web technologies**
