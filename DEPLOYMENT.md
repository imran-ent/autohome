# AutoHome Batteries - Deployment Guide

## Overview
AutoHome Batteries is a premium battery retail and management platform. The website functions as a product catalogue and lead-generation platform where customers browse batteries and contact the business via WhatsApp or phone to place orders. No online payment processing is available.

## Architecture Overview

### Frontend
- **Framework**: React 18 with Vite 6
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **Icons**: React Router DOM v7
- **Build Tool**: Vite
- **Deployment**: Cloudflare Pages
- Build Output: `client/dist/`

### Backend
- **Framework**: Node.js + Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT + bcryptjs
- **Deployment**: Render
- Build Output: N/A (Node.js server)

### Dual Authentication
The application supports dual authentication:
- **Customer**: Regular customers can browse products, submit maintenance requests, and contact the business
- **Admin**: Admin users can manage products, orders, customers, maintenance requests, suppliers, and inventory

---

## Deployment Steps

### Prerequisites

1. **Node.js** v18+ installed
2. **MongoDB Atlas** account with a cluster provisioned
3. **Render** account for backend hosting
4. **Cloudflare** account for Cloudflare Pages hosting
5. **GitHub** account for code repository

---

## Step 1: Prepare MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new project or select an existing one
3. Create a new cluster (free tier M0 is sufficient for development)
4. Configure network access:
   - Add `0.0.0.0/0` to allow access from Render
   - Or add specific Render IP addresses
5. Create a database user with read/write access
6. Get the connection string (SRV format)

Example connection string:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/autohome_batteries?retryWrites=true&w=majority
```

---

## Step 2: Deploy Backend to Render

### Step 1: Prepare server/.env

Create `server/.env` with the following variables (replace placeholders with your actual values):

```env
# Server
PORT=10000
NODE_ENV=production
CLIENT_URL=https://your-cloudflare-pages-domain.pages.dev

# MongoDB
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/autohome_batteries?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_jwt_secret_change_me
JWT_EXPIRE=7d

# Admin seed (initial admin account)
ADMIN_EMAIL=autohomebatteries@gmail.com
ADMIN_PASSWORD=Admin@1234
ADMIN_NAME=Mohammed Umer A

# Business contact
BUSINESS_PHONE_1=9789688756
BUSINESS_PHONE_2=9443437168
BUSINESS_EMAIL=autohomebatteries@gmail.com
BUSINESS_ADDRESS=Opp. SN Tea Stall, Maula Street, Pernambut 635810, Tamil Nadu
BUSINESS_TIMING=6:00 AM to 10:00 PM

# Puter AI
PUTER_AUTH_TOKEN=your_puter_auth_token_here
PUTER_MODEL=gpt-5.5
```

**Important**: Replace `PUTER_AUTH_TOKEN` with your actual Puter AI token. Leave other values as-is or customize as needed.

### Step 2: Deploy to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the `AutoHome Batteries` repository
5. Configure the following settings:

| Setting | Value |
|---------|-------|
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `node server.js` |
| Root Directory | `server` |
| Instance Type | Free |

6. Add environment variables from `server/.env` (excluding `PORT` which Render sets automatically)
7. Click "Create Web Service"

### Step 3: Verify Backend Deployment

Once deployed, visit `https://your-backend.onrender.com/api/health` to verify the server is running:

```json
{
  "success": true,
  "message": "AutoHome Batteries API is running"
}
```

---

## Step 3: Deploy Frontend to Cloudflare Pages

### Step 1: Prepare client/.env

Create `client/.env` with the following variables:

```env
# AutoHome Batteries - Client Environment
VITE_API_URL=https://your-backend.onrender.com
```

Replace `https://your-backend.onrender.com` with your actual Render backend URL.

### Step 2: Deploy to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Go to "Workers & Pages" → "Create application"
3. Select "Pages" → "Connect to Git"
4. Connect your GitHub repository
5. Select the `AutoHome Batteries` repository
6. Configure the following settings:

| Setting | Value |
|---------|-------|
| Project name | autohome-batteries |
| Production branch | main |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/client` |

7. In "Environment variables", add:
   - `VITE_API_URL` = `https://your-backend.onrender.com`
8. Click "Create Project"

### Step 4: Verify Frontend Deployment

Once deployed, visit your Cloudflare Pages URL (e.g., `https://autohome-batteries.pages.dev`) to verify the website loads correctly.

---

## Step 4: Verify Deployment

### Backend Health Check
Visit: `https://your-backend.onrender.com/api/health`
Expected response:
```json
{"success":true,"message":"AutoHome Batteries API is running"}
```

### Frontend Verification
Visit your Cloudflare Pages URL and verify:
1. ✅ Homepage loads with battery categories
2. ✅ Batteries page displays products with images
3. ✅ Product detail page shows product information
4. ✅ WhatsApp buttons open WhatsApp chat
5. ✅ Call buttons trigger phone dialer
6. ✅ Admin login works at `/admin/login`
7. ✅ Admin can add/edit/delete products

---

## Step 5: Environment Variables Summary

### Server (.env) - Render Dashboard

| Variable | Example Value | Required |
|----------|---------------|----------|
| PORT | 10000 | Auto-set by Render |
| NODE_ENV | production | Yes |
| CLIENT_URL | https://your-cloudflare-pages.pages.dev | Yes |
| MONGO_URI | mongodb+srv://... | Yes |
| JWT_SECRET | your-secret-key | Yes |
| JWT_EXPIRE | 7d | Optional |
| ADMIN_EMAIL | admin@example.com | Yes |
| ADMIN_PASSWORD | your-secure-password | Yes |
| ADMIN_NAME | Admin User | Optional |
| BUSINESS_PHONE_1 | 9789688756 | Optional |
| BUSINESS_PHONE_2 | 9443437168 | Optional |
| BUSINESS_EMAIL | info@yourdomain.com | Optional |
| BUSINESS_ADDRESS | Your business address | Optional |
| BUSINESS_TIMING | 9:00 AM to 6:00 PM | Optional |
| PUTER_AUTH_TOKEN | your-puter-token | Optional (for AI features) |
| PUTER_MODEL | gpt-5.5 | Optional |

### Client (.env) - Cloudflare Pages

| Variable | Example Value | Required |
|----------|---------------|----------|
| VITE_API_URL | https://your-backend.onrender.com | Yes |

---

## Step 6: MongoDB Atlas Configuration

1. Log in to MongoDB Atlas
2. Select your project
3. Go to "Database Access" and create a database user with read/write access
4. Go to "Network Access" and add IP address `0.0.0.0/0` (allow all) or specific Render IPs
5. Get the connection string from "Connect" → "Drivers" → "Node.js"

Connection string format:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/autohome_batteries?retryWrites=true&w=majority
```

---

## Troubleshooting

### Backend Issues

**Backend fails to start:**
- Check that `MONGO_URI` is correctly set in Render environment variables
- Ensure MongoDB Atlas network access allows Render's IP addresses
- Check Render logs for detailed error messages

**Health check returns error:**
- Verify MongoDB connection string is correct
- Check that database user has read/write permissions
- Verify `JWT_SECRET` is set

### Frontend Issues

**Build fails:**
- Check that `VITE_API_URL` is set in Cloudflare Pages environment variables
- Ensure all dependencies are installed (`npm install`)
- Check for syntax errors in JavaScript files

**API calls fail:**
- Verify `VITE_API_URL` matches your Render backend URL
- Check CORS configuration in `server/app.js`
- Verify backend is running and accessible

**Images don't load:**
- Product images are stored as URLs in the database
- Ensure image URLs are publicly accessible
- Check browser console for 404 errors on images

---

## Security Checklist

- [ ] `.env` files are in `.gitignore`
- [ ] `JWT_SECRET` is a strong, random string
- [ ] No API keys or secrets in frontend code
- [ ] `VITE_API_URL` only contains the backend URL (no secrets)
- [ ] CORS is configured to allow only your frontend domain
- [ ] Admin routes require authentication
- [ ] Passwords are hashed with bcrypt
- .env.example contains placeholder values only

---

## MongoDB Atlas Setup Steps

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or log in
3. Click "Build a Database"
4. Select "Shared (Free Tier)"
5. Choose AWS as provider and select a region close to your Render region
4. Cluster name: `autohome-batteries`
5. Click "Create Deployment"
6. Create database user:
   - Username: `autohome_admin`
   - Password: Generate a strong password
   - Role: `Read and Write to any database`
7. Configure Network Access:
   - Add IP address: `0.0.0.0/0` (allow all) for development
   - For production, add specific Render IP addresses
8. Click "Connect" → "Drivers" → "Node.js"
9. Copy the connection string and update `MONGO_URI` in Render environment variables

---

## External Dependencies

### External Services Required

| Service | Purpose | Free Tier |
|---------|---------|-----------|
| MongoDB Atlas | Database | 512 MB storage |
| Render | Backend hosting | 512 MB RAM, 24/7 |
| Cloudflare Pages | Frontend hosting | Unlimited bandwidth |

### No API Keys Required for Core Functionality

The following are optional:
- **Puter AI**: Required for AI Battery Finder feature (get token from Puter.ai)
- **Cloudflare**: Free tier sufficient for hosting

---

## Troubleshooting Common Issues

### Build Fails on Cloudflare Pages
- Check that `package.json` has correct build script: `"build": "vite build"`
- Ensure `vite.config.js` is in client directory
- Check build logs for specific errors

### Backend Crashes on Render
- Check Render build logs for dependency installation errors
- Verify `MONGO_URI` is correctly set
- Check that all dependencies are in `package.json`

### Images Not Loading
- Verify image URLs in database are publicly accessible
- Check browser console for CORS errors
- Verify images exist at the specified URLs

### Admin Login Fails
- Verify admin user exists in database
- Check that `ADMIN_EMAIL` and `ADMIN_PASSWORD` match what's in database
- Verify JWT_SECRET is set consistently

---

## File Structure

```
Default Project/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── layouts/
│   │   └── App.jsx
│   ├── public/
│   │   ├── robots.txt
│   │   └── sitemap.xml
│   ├── package.json
│   ├── vite.config.js
│   ├── .env
│   └── index.html
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── dashboardController.js
│   │   ├── inventoryController.js
│   │   ├── maintenanceController.js
│   │   └── supplierController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── MaintenanceRequest.js
│   │   ├── Supplier.js
│   │   └── StockTransaction.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── aiRoutes.js
│   │   ├── inventoryRoutes.js
│   │   ├── maintenanceRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── supplierRoutes.js
│   ├── utils/
│   │   ├── asyncHandler.js
│   │   ├── jwtUtils.js
│   │   └── responseHelper.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── adminMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── notFoundMiddleware.js
│   ├── seeds/
│   │   └── seedAdmin.js
│   ├── server.js
│   ├── app.js
│   ├── package.json
│   └── .env
├── .env.example
├── .gitignore
├── .gitignore
├── DEPLOYMENT.md
└── README.md
```

---

## Support

For issues with this deployment:
1. Check backend logs in Render dashboard
2. Check frontend build logs in Cloudflare Pages dashboard
3. Verify all environment variables are set correctly
4. Test API endpoints directly with curl or Postman