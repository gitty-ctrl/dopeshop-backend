import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './api/routes/auth.routes';

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
    ...(process.env.FRONTEND_PROD_URL ? [process.env.FRONTEND_PROD_URL] : []),
  ],
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Products (existing)
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
      {
        id: 'prod_4',
        name: 'Phone Stand',
        price: 19.99,
        emoji: '📱',
        category: 'Office',
        origin: 'london',
        estimatedDays: 1,
      },
      {
        id: 'prod_5',
        name: 'Plant Pot',
        price: 24.99,
        emoji: '🪴',
        category: 'Home',
        origin: 'manchester',
        estimatedDays: 2,
      },
      {
        id: 'prod_6',
        name: 'USB-C Cable',
        price: 15.99,
        emoji: '🔌',
        category: 'Electronics',
        origin: 'london',
        estimatedDays: 1,
      },
      {
        id: 'prod_7',
        name: 'Notebook',
        price: 8.99,
        emoji: '📓',
        category: 'Office',
        origin: 'bristol',
        estimatedDays: 1,
      },
      {
        id: 'prod_8',
        name: 'Desk Organizer',
        price: 29.99,
        emoji: '📦',
        category: 'Office',
        origin: 'birmingham',
        estimatedDays: 2,
      },
    ],
  });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  console.log(`📚 Auth endpoints: /api/auth/register, /api/auth/login, /api/auth/me`);
});