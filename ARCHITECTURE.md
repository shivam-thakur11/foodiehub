# FoodieHub — Application Architecture

> Internal reference document. Do not publish or commit to a public repository.

---

## Stack

| Layer      | Technology                                  |
|------------|---------------------------------------------|
| Frontend   | React 18 + Vite 6                           |
| Styling    | Tailwind CSS 3                              |
| HTTP client| Axios                                       |
| Router     | React Router DOM v6                         |
| Backend    | Node.js + Express 4                         |
| Database   | MongoDB 8 (local) via Mongoose 8            |
| Auth       | JSON Web Token (JWT) + bcryptjs             |
| File upload| Multer                                      |
| Logger     | Morgan                                      |
| Validation | express-validator                           |

---

## Directory Layout

```
foodiehub/
├── client/                     React + Vite frontend
│   ├── .env                    VITE_API_URL=http://localhost:5003/api
│   ├── vite.config.js          Proxy /api → localhost:5003
│   ├── index.html
│   └── src/
│       ├── main.jsx            Entry — mounts BrowserRouter > AuthProvider > CartProvider > App
│       ├── App.jsx             Route definitions (lazy-loaded pages)
│       ├── index.css           Base Tailwind directives + Inter font
│       ├── services/
│       │   └── api.js          Axios instance (baseURL = VITE_API_URL)
│       ├── context/
│       │   ├── AuthContext.jsx JWT auth state (localStorage: fh_token, fh_user)
│       │   └── CartContext.jsx Client-side cart (localStorage: fh_cart)
│       ├── components/
│       │   ├── layout/         Navbar, Footer, Layout
│       │   ├── food/           FoodCard
│       │   ├── common/         Skeleton, Spinner, Modal, EmptyState,
│       │   │                   LoadingScreen, ProtectedRoute, AdminRoute
│       │   └── admin/          AdminLayout
│       └── pages/
│           ├── Home.jsx
│           ├── Menu.jsx
│           ├── FoodDetails.jsx
│           ├── Cart.jsx
│           ├── Checkout.jsx
│           ├── Login.jsx
│           ├── Register.jsx
│           ├── Profile.jsx
│           ├── Orders.jsx
│           ├── OrderDetails.jsx
│           ├── OrderSuccess.jsx
│           ├── NotFound.jsx
│           └── admin/
│               ├── Dashboard.jsx
│               ├── Foods.jsx
│               ├── Categories.jsx
│               ├── AdminOrders.jsx
│               └── Users.jsx
│
└── server/                     Node.js + Express backend
    ├── .env                    PORT, MONGO_URI, JWT_SECRET, CLIENT_URL
    ├── server.js               Entry — connects DB, starts HTTP server, prints route map
    ├── app.js                  Express app — CORS, body parsers, Morgan, routes, error handler
    ├── seed.js                 Database seeder (npm run seed)
    ├── config/
    │   └── db.js               Mongoose.connect wrapper
    ├── models/
    │   ├── User.js
    │   ├── Food.js
    │   ├── Category.js
    │   ├── Cart.js
    │   └── Order.js
    ├── routes/
    │   ├── authRoutes.js       /api/auth
    │   ├── foodRoutes.js       /api/foods
    │   ├── categoryRoutes.js   /api/categories
    │   ├── cartRoutes.js       /api/cart
    │   ├── orderRoutes.js      /api/orders
    │   ├── adminRoutes.js      /api/admin
    │   └── userRoutes.js       /api/users
    ├── controllers/
    │   ├── authController.js
    │   ├── foodController.js
    │   ├── categoryController.js
    │   ├── cartController.js
    │   ├── orderController.js
    │   ├── adminController.js
    │   └── userController.js
    ├── middleware/
    │   ├── auth.js             protect (JWT verify) + adminOnly (role check)
    │   ├── errorHandler.js     Central Express error handler
    │   ├── upload.js           Multer config (disk storage → /uploads)
    │   └── validate.js         express-validator result checker
    └── utils/
        ├── apiResponse.js      successResponse / errorResponse / paginatedResponse
        └── generateToken.js    jwt.sign helper
```

---

## Data Models

### User
| Field       | Type     | Notes                          |
|-------------|----------|--------------------------------|
| name        | String   | required                       |
| email       | String   | unique, lowercase              |
| password    | String   | bcrypt hashed, select:false    |
| phone       | String   |                                |
| role        | String   | 'user' \| 'admin'              |
| addresses   | Array    | subdocuments (label/street/…)  |
| isActive    | Boolean  | default true                   |

### Category
| Field       | Type     | Notes                          |
|-------------|----------|--------------------------------|
| name        | String   | unique                         |
| description | String   |                                |
| image       | String   | URL or /uploads path           |
| isActive    | Boolean  | default true                   |

### Food
| Field           | Type     | Notes                          |
|-----------------|----------|--------------------------------|
| name            | String   | required                       |
| description     | String   |                                |
| price           | Number   |                                |
| image           | String   |                                |
| category        | ObjectId | ref: Category                  |
| rating          | Number   | computed from reviews          |
| numReviews      | Number   |                                |
| reviews         | Array    | {user, name, rating, comment}  |
| isAvailable     | Boolean  | default true                   |
| isVegetarian    | Boolean  |                                |
| isFeatured      | Boolean  |                                |
| preparationTime | Number   | minutes                        |

### Cart
| Field  | Type     | Notes                          |
|--------|----------|--------------------------------|
| user   | ObjectId | ref: User, unique              |
| items  | Array    | {food, quantity, price}        |

### Order
| Field           | Type     | Notes                                 |
|-----------------|----------|---------------------------------------|
| user            | ObjectId | ref: User                             |
| items           | Array    | {food, name, image, price, quantity}  |
| deliveryAddress | Object   | embedded address subdoc               |
| subtotal        | Number   |                                       |
| deliveryFee     | Number   | fixed ₹40                             |
| tax             | Number   | 5% of subtotal                        |
| discount        | Number   | from coupon                           |
| couponCode      | String   |                                       |
| totalAmount     | Number   |                                       |
| paymentMethod   | String   | COD \| CARD \| UPI                    |
| paymentStatus   | String   | Pending \| Paid \| Failed \| Refunded |
| orderStatus     | String   | Pending → Confirmed → … → Delivered   |
| notes           | String   |                                       |

