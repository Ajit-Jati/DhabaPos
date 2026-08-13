import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Firebase Admin SDK
// For local development, use: export GOOGLE_APPLICATION_CREDENTIALS="/path/to/serviceAccountKey.json"
// For production (Render), add the service account JSON as environment variable
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // Production: from environment variable
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID
    });
  } else {
    // Development: using default credentials
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID
    });
  }
  console.log('✅ Firebase Admin SDK initialized');
} catch (error) {
  console.warn('⚠️ Firebase not fully configured (local development mode)');
}

// Get Firestore instance
const db = admin.firestore();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Backend is running ✅',
    timestamp: new Date().toISOString()
  });
});

// Get all restaurants
app.get('/api/restaurants', async (req, res) => {
  try {
    const snapshot = await db.collection('restaurants').get();
    const restaurants = [];
    snapshot.forEach(doc => {
      restaurants.push({ id: doc.id, ...doc.data() });
    });
    res.json({ success: true, data: restaurants });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get menu items
app.get('/api/menu', async (req, res) => {
  try {
    const snapshot = await db.collection('menu').get();
    const menu = [];
    snapshot.forEach(doc => {
      menu.push({ id: doc.id, ...doc.data() });
    });
    res.json({ success: true, data: menu });
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create a new order
app.post('/api/orders', async (req, res) => {
  try {
    const orderData = {
      ...req.body,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    
    const docRef = await db.collection('orders').add(orderData);
    res.json({ 
      success: true,
      message: 'Order created',
      orderId: docRef.id
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get orders
app.get('/api/orders', async (req, res) => {
  try {
    const snapshot = await db.collection('orders').orderBy('createdAt', 'desc').get();
    const orders = [];
    snapshot.forEach(doc => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: error.message });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📍 API Base: http://localhost:${PORT}/api`);
});
