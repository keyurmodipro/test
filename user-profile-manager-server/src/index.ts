import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { testConnection } from './config/db';
import userRoutes from './routes/userRoutes';

// ──────────────────────────────────────────────
// Express App Setup
// ──────────────────────────────────────────────

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// ── Middleware ─────────────────────────────────
app.use(helmet());                                    // Security headers
app.use(cors({ origin: 'http://localhost:5173' }));   // Allow Vite dev server
app.use(morgan('dev'));                               // Request logging
app.use(express.json());                              // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────
app.use('/api', userRoutes);

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── 404 Handler ───────────────────────────────
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ── Global Error Handler ──────────────────────
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

// ── Start Server ──────────────────────────────
const startServer = async (): Promise<void> => {
  await testConnection();

  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📋 API Base: http://localhost:${PORT}/api\n`);
  });
};

startServer();
