# 🚀 Deployment Guide - Backend to Render & Frontend to Netlify

## **Your Firebase Config** ✅
```
Project: dhabapos
API Key: AIzaSyDIQuraw9t2xxHrLsmG-BTlUX51UaN5iPc
Auth Domain: dhabapos.firebaseapp.com
Project ID: dhabapos
Storage Bucket: dhabapos.firebasestorage.app
```

---

## **STEP 1: Deploy Backend to Render**

### 1.1 Get Service Account Key (Required for Render)
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select **dhabapos** project
3. Go to **⚙️ Project Settings** → **Service Accounts** tab
4. Click **Generate New Private Key**
5. Save the downloaded JSON file **securely**

### 1.2 Push Code to GitHub
```bash
cd backend
git init
git add .
git commit -m "Add Express backend with Firebase"
git push origin main
```

### 1.3 Deploy to Render
1. Go to [render.com](https://render.com) → Sign up
2. Click **New +** → **Web Service**
3. Connect your GitHub repo
4. **Configuration:**
   - **Name:** `dhabapos-backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free (for testing)

### 1.4 Add Environment Variables in Render
In your Render service dashboard:
1. Go to **Environment** tab
2. Add these variables:
```
PORT=
NODE_ENV=production
FIREBASE_PROJECT_ID=dhabapos
FIREBASE_API_KEY=AIzaSyDIQuraw9t2xxHrLsmG-BTlUX51UaN5iPc
FIREBASE_AUTH_DOMAIN=dhabapos.firebaseapp.com
FIREBASE_STORAGE_BUCKET=dhabapos.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=206124488099
FIREBASE_APP_ID=1:206124488099:web:09e322bee63596da34f616
FIREBASE_SERVICE_ACCOUNT={paste entire JSON from service account key}
```

**⚠️ For FIREBASE_SERVICE_ACCOUNT:**
- Open the JSON file you downloaded
- Copy the entire contents
- Paste it as a single-line string in Render

### 1.5 Deploy
Click **Deploy** and wait for it to finish.

**Your Backend URL:** `https://your-service-name.onrender.com`

---

## **STEP 2: Deploy Frontend to Netlify**

### 2.1 Update Frontend Environment
Update `frontend/.env`:
```env
VITE_API_URL=https://your-service-name.onrender.com
```
(Replace with your actual Render URL)

### 2.2 Push to GitHub
```bash
cd frontend
git add .
git commit -m "Add React frontend with API integration"
git push origin main
```

### 2.3 Deploy to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Click **Add new site** → **Import an existing project**
3. Connect GitHub
4. **Configuration:**
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
   - **Environment Variables:**
     ```
     VITE_API_URL=https://your-service-name.onrender.com
     VITE_FIREBASE_API_KEY=AIzaSyDIQuraw9t2xxHrLsmG-BTlUX51UaN5iPc
     VITE_FIREBASE_AUTH_DOMAIN=dhabapos.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=dhabapos
     VITE_FIREBASE_STORAGE_BUCKET=dhabapos.firebasestorage.app
     VITE_FIREBASE_MESSAGING_SENDER_ID=206124488099
     VITE_FIREBASE_APP_ID=1:206124488099:web:09e322bee63596da34f616
     ```

### 2.4 Deploy
Click **Deploy** and wait for it to finish.

**Your Frontend URL:** `https://your-site.netlify.app`

---

## **STEP 3: Test the Connection**

### Test Backend
```
GET https://your-service-name.onrender.com/api/health
```
Should return:
```json
{
  "status": "Backend is running ✅",
  "timestamp": "2024-08-13T..."
}
```

### Test Frontend
Visit your Netlify URL and check if it loads without errors.

### Test Backend ↔ Frontend Communication
Open **Developer Console** (F12) and check if the frontend can connect to the backend.

---

## **API Endpoints Available**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/restaurants` | Get all restaurants |
| GET | `/api/menu` | Get menu items |
| GET | `/api/orders` | Get all orders |
| POST | `/api/orders` | Create new order |

---

## **Using the API in Frontend**

```javascript
import api from './api.js';

// Get restaurants
const restaurants = await api.getRestaurants();

// Get menu
const menu = await api.getMenu();

// Create order
const order = await api.createOrder({
  restaurantId: '123',
  items: [{ name: 'Samosa', price: 50 }],
  total: 50
});
```

---

## **Troubleshooting**

### ❌ CORS Error
**Solution:** Add your Netlify URL to backend CORS in `server.js`:
```javascript
app.use(cors({
  origin: 'https://your-site.netlify.app'
}));
```

### ❌ 404 Not Found
**Solution:** Make sure your Render URL is correct in frontend `.env`

### ❌ Firebase Connection Error
**Solution:** Verify service account JSON is correctly pasted in Render environment variables

---

## **Important Notes**

✅ Backend and Frontend must be deployed separately
✅ Firebase handles authentication & database
✅ Backend acts as API gateway to Firestore
✅ Update URLs after deployment in both services
✅ Keep service account key secure, never commit to git

---

**Questions?** Check the logs in Render or Netlify dashboard!
