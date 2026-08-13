/**
 * API Service for communicating with the backend server
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Generic fetch wrapper
async function apiCall(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  return response.json();
}

// API Methods
export const api = {
  // Health check
  checkHealth: () => apiCall('/api/health'),

  // Restaurants
  getRestaurants: () => apiCall('/api/restaurants'),
  
  // Menu
  getMenu: () => apiCall('/api/menu'),
  
  // Orders
  getOrders: () => apiCall('/api/orders'),
  createOrder: (orderData) => apiCall('/api/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  }),
  
  // Add more endpoints as needed
};

export default api;
