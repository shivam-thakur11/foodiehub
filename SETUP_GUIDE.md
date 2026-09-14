# 🚀 Quick Setup Guide for FoodieHub

Follow these steps to get FoodieHub up and running on your local machine.

## ✅ Pre-Installation Checklist

Before starting, make sure you have:
- [ ] Node.js installed (v16 or higher) - [Download](https://nodejs.org/)
- [ ] MongoDB installed and running - [Download](https://www.mongodb.com/try/download/community)
  - OR MongoDB Atlas account for cloud database - [Sign up](https://www.mongodb.com/cloud/atlas)
- [ ] A code editor (VS Code recommended) - [Download](https://code.visualstudio.com/)
- [ ] Git installed (optional) - [Download](https://git-scm.com/)

## 📋 Step-by-Step Installation

### Step 1: Verify Prerequisites

Open a terminal and run:
```bash
node --version    # Should show v16 or higher
npm --version     # Should show v8 or higher
mongod --version  # Should show MongoDB version (if using local)
```

### Step 2: Install Server Dependencies

```bash
cd server
npm install
```

**Expected output:** All dependencies installed successfully without errors.

### Step 3: Configure Server Environment

Create `server/.env` file:
```bash
# Copy the example file
cp .env.example .env
```

Edit `server/.env` with your values:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database (choose one)
# Local MongoDB:
MONGO_URI=mongodb://localhost:27017/foodiehub

# OR MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/foodiehub

# JWT Secret (change this to a random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Client URL
CLIENT_URL=http://localhost:5173
```

### Step 4: Seed the Database

```bash
cd server
npm run seed
```

**Expected output:**
```
✓ Connected to MongoDB
✓ Database cleared
✓ Created 8 categories
✓ Created 24 food items
✓ Created 2 users
✓ Seeding completed successfully!

Demo Accounts:
👤 User: user@foodiehub.com / user123
🛡️  Admin: admin@foodiehub.com / admin123
```

### Step 5: Install Client Dependencies

```bash
cd ../client
npm install
```

### Step 6: Configure Client Environment

Create `client/.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 7: Start the Application

**Terminal 1 - Server:**
```bash
cd server
npm run dev
```

**Expected output:**
```
╔══════════════════════════════════════╗
║   FoodieHub Server running on 5000   ║
║   Environment: development           ║
╚══════════════════════════════════════╝
✓ MongoDB Connected: localhost
```

**Terminal 2 - Client:**
```bash
cd client
npm run dev
```

**Expected output:**
```
VITE v6.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Step 8: Access the Application

Open your browser and go to: **http://localhost:5173**

You should see the FoodieHub homepage! 🎉

## 🧪 Testing the Setup

### 1. Test User Login
- Click "Sign in" in the navigation
- Use: `user@foodiehub.com` / `user123`
- You should be redirected to the homepage as a logged-in user

### 2. Test Browse & Cart
- Browse food items on the menu page
- Click "Add to Cart" on any item
- View your cart and verify items appear
- Try updating quantities

### 3. Test Checkout (as User)
- Go to cart and click "Checkout"
- Fill in a delivery address
- Try applying coupon code: `WELCOME20`
- Place an order
- Verify order success page appears

### 4. Test Admin Panel
- Logout from user account
- Login with: `admin@foodiehub.com` / `admin123`
- Access admin dashboard from the profile dropdown
- Verify you can see:
  - Dashboard statistics
  - Order management
  - Food management
  - Category management
  - User management

## 🐛 Troubleshooting

### MongoDB Connection Error
**Error:** `MongoNetworkError: connect ECONNREFUSED`

**Solution:**
1. Make sure MongoDB is running:
   ```bash
   # On Windows (if installed as service):
   net start MongoDB
   
   # On Mac/Linux:
   sudo systemctl start mongod
   ```
2. Or use MongoDB Atlas and update your MONGO_URI in `.env`

### Port Already in Use
**Error:** `Port 5000 is already in use`

**Solution:**
1. Change the port in `server/.env`:
   ```env
   PORT=5001
   ```
2. Update `client/.env`:
   ```env
   VITE_API_URL=http://localhost:5001/api
   ```

### Cannot Find Module Error
**Error:** `Cannot find module 'xyz'`

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors in Client
**Error:** Build fails with various errors

**Solution:**
```bash
cd client
npm run build
# If there are errors, they will be displayed
# Fix the reported issues and try again
```

## 🔍 Verification Checklist

After setup, verify these work:
- [ ] Homepage loads without errors
- [ ] User can register a new account
- [ ] User can login with demo credentials
- [ ] Food items display with images
- [ ] Search and filter work on menu page
- [ ] Items can be added to cart
- [ ] Checkout process completes successfully
- [ ] Coupon codes apply discounts correctly
- [ ] Admin dashboard is accessible
- [ ] Admin can manage orders, foods, and users

## 📞 Need Help?

If you encounter issues:
1. Check the browser console for errors (F12)
2. Check server terminal for error messages
3. Verify all environment variables are set correctly
4. Ensure MongoDB is running and accessible
5. Try clearing browser cache and localStorage
6. Refer to the main README.md for API documentation

## 🎯 Next Steps

Once everything is working:
1. Explore the admin panel features
2. Test the review system
3. Try different payment methods
4. Test responsive design on mobile
5. Review the code structure in both client and server
6. Consider adding your own features!

---

**Happy Coding! 🚀**
