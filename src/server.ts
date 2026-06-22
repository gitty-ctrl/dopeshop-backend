import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.FRONTEND_URL || '',
    process.env.FRONTEND_PROD_URL || '',
  ].filter(Boolean),
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Sample products endpoint
app.get('/api/products', (req, res) => {
  res.json({
    products: [
      {
        id: 'prod_1',
        name: 'Wireless Earbuds',
        price: 79.99,
        emoji: '🎧',
        category: 'Electronics',
        origin: 'shanghai',
        estimatedDays: 14,
      },
      {
        id: 'prod_2',
        name: 'Desk Lamp',
        price: 34.99,
        emoji: '💡',
        category: 'Office',
        origin: 'london',
        estimatedDays: 1,
      },
      {
        id: 'prod_3',
        name: 'Coffee Mug',
        price: 12.99,
        emoji: '☕',
        category: 'Home',
        origin: 'manchester',
        estimatedDays: 1,
      },
    ],
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  console.log(`📊 API docs: http://localhost:${PORT}/health`);
});