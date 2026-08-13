# Backend API - Hotel Restaurant POS

Express.js backend API for the Hotel Restaurant POS system.

## Setup

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with your Firebase credentials:
```
PORT=5000
NODE_ENV=development
FIREBASE_API_KEY=your_key
FIREBASE_DATABASE_URL=your_url
```

3. Run development server:
```bash
npm run dev
```

Server will run on `http://localhost:5000`

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/hotels` - Get hotels
- `GET /api/menu` - Get menu items
- `POST /api/orders` - Create new order

## Deploy to Render

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Add backend server"
git push origin main
```

### Step 2: Create Render Service
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Fill in:
   - **Name**: `dhaba-backend` (or your choice)
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Select your branch

### Step 3: Add Environment Variables
In Render dashboard:
1. Go to your service → Environment
2. Add all variables from `.env` file:
   - `PORT` (optional, Render auto-assigns)
   - `NODE_ENV=production`
   - `FIREBASE_API_KEY`
   - `FIREBASE_DATABASE_URL`

### Step 4: Deploy
Click "Deploy" and your backend will be live!

Your backend URL will be: `https://your-service-name.onrender.com`

## Update Frontend

Once deployed, update your frontend `.env`:
```
VITE_API_URL=https://your-service-name.onrender.com
```

Then redeploy frontend to Netlify.
