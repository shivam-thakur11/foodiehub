# 🍔 FoodieHub - Food Ordering Platform

A full-stack food ordering platform built with the MERN stack (MongoDB, Express, React, Node.js).

## ✨ Features

### Customer Features
- 🔐 User authentication (register, login, JWT-based sessions)
- 🍕 Browse food items by category with search and filters
- ⭐ View food details with ratings and reviews
- 🛒 Shopping cart with add/remove/update functionality
- 💳 Multiple payment methods (COD, Card, UPI - test mode)
- 🎟️ Coupon/discount system with multiple codes
- 📦 Order tracking and history
- 👤 Profile management with multiple delivery addresses
- 📝 Submit reviews and ratings for food items

### Admin Features
- 📊 Dashboard with statistics and analytics
- 🍱 Food management (CRUD operations)
- 📂 Category management
- 📋 Order management with status updates
- 👥 User management
- 🔍 Server-side search with debouncing

### Technical Features
- ✅ Form validation (client and server)
- 🔒 Security: regex injection prevention, quantity validation
- 🚀 Responsive design with Tailwind CSS
- ⚡ Optimized performance with code splitting
- 🎨 Modern UI with Lucide icons
- 🔥 Real-time notifications with React Hot Toast
- 📱 Mobile-friendly interface

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt.js** - Password hashing
- **Multer** - File uploads
- **Morgan** - Logging

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd foodiehub
```

### 2. Server Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/foodiehub
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 3. Client Setup
```bash
cd ../client
npm install
```

Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Seed the Database
```bash
cd ../server
npm run seed
```

This will create:
- Sample categories (Pizza, Burgers, Indian, Chinese, etc.)
- Sample food items with images
- Demo accounts (see below)

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Start Server:**
```bash
cd server
npm run dev
```
Server runs on http://localhost:5000

**Terminal 2 - Start Client:**
```bash
cd client
npm run dev
```
Client runs on http://localhost:5173

### Production Build

**Build Client:**
```bash
cd client
npm run build
```

**Start Server:**
```bash
cd server
npm start
```

## 👤 Demo Accounts

After seeding, you can login with:

**User Account:**
- Email: `user@foodiehub.com`
- Password: `user123`

**Admin Account:**
- Email: `admin@foodiehub.com`
- Password: `admin123`

## 🎟️ Available Coupons

Try these coupon codes at checkout:
- **WELCOME20** - 20% off on any order
- **SAVE50** - ₹50 off on orders above ₹200
- **FLAT100** - ₹100 off on orders above ₹500

## 📁 Project Structure

```
foodiehub/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context providers
│   │   ├── hooks/         # Custom hooks
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service
│   │   └── utils/         # Utility functions
│   ├── public/            # Static assets
│   └── package.json
│
└── server/                # Node.js backend
    ├── config/            # Configuration files
    ├── controllers/       # Route controllers
    ├── middleware/        # Custom middleware
    ├── models/            # Mongoose models
    ├── routes/            # API routes
    ├── utils/             # Utility functions
    ├── uploads/           # Uploaded files (auto-created)
    ├── seed.js            # Database seeder
    └── package.json
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Foods
- `GET /api/foods` - Get all foods (with filters)
- `GET /api/foods/:id` - Get food by ID
- `POST /api/foods/:id/reviews` - Submit review (auth)
- `POST /api/foods` - Create food (admin)
- `PUT /api/foods/:id` - Update food (admin)
- `DELETE /api/foods/:id` - Delete food (admin)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove from cart
- `DELETE /api/cart` - Clear cart

### Orders
- `POST /api/orders` - Place order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/orders` - All orders (with search)
- `PUT /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/users` - All users
- `PUT /api/admin/users/:id/role` - Update user role
- `PUT /api/admin/users/:id/toggle-status` - Toggle user status

## 🐛 Fixed Issues

This version includes fixes for:
1. ✅ Seed.js double-hashing bug - Demo credentials now work
2. ✅ Auth profile null-overwrite - Updating addresses doesn't wipe name/phone
3. ✅ FoodDetails related foods filtering by category
4. ✅ Review submission system with rating recalculation
5. ✅ AdminOrders server-side search with debouncing
6. ✅ Regex injection prevention in category and food controllers
7. ✅ Quantity validation in order placement
8. ✅ Navigate-during-render anti-pattern in Login/Register
9. ✅ Uploads directory auto-creation on server start
10. ✅ Dead code removal (unused api/ and store/ directories)
11. ✅ Coupon/discount system implementation

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Regex injection prevention
- Input validation (client and server)
- Quantity validation (1-50 items)
- CORS protection
- Express async error handling

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop (1920x1080 and above)
- Laptop (1366x768)
- Tablet (768x1024)
- Mobile (375x667 and above)

## 🎨 UI/UX Features

- Modern, clean interface
- Smooth animations and transitions
- Loading skeletons for better UX
- Empty states with helpful messages
- Toast notifications for user feedback
- Modal dialogs for detailed views
- Sticky navigation and cart summary

## 🚧 Future Enhancements

- Real payment gateway integration
- Order tracking with map
- Push notifications
- Advanced analytics dashboard
- Loyalty points system
- Restaurant ratings
- Social media integration
- Multi-language support

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, email support@foodiehub.com or open an issue in the repository.

---

Made with ❤️ by FoodieHub Team
