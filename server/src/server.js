// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';

// dotenv.config();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Health-check API
// app.get('/api/health', (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: 'ShopSmart AI backend is running!'
//   });
// });

// // Server configuration
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { verifyToken } from './middleware/authMiddleware.js';
import orderRoutes from './routes/orderRoutes.js';
import aiRoutes from './ai/routes/aiRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'ShopSmart AI backend is running!'
  });
});
app.use('/api/orders', orderRoutes);
// Test PostgreSQL connection
app.get('/api/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');

    res.status(200).json({
      success: true,
      message: 'PostgreSQL connected successfully!',
      databaseTime: result.rows[0].now
    });
  } catch (error) {
    console.error('Database connection failed:', error.message);

    res.status(500).json({
      success: false,
      message: 'Database connection failed'
    });
  }
});
app.get('/api/protected', verifyToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'You accessed a protected API!',
    user: req.user
  });
});

//test
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
