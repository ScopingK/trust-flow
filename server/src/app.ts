import express from 'express';
import cors from 'cors';
import { authMiddleware } from './middleware/auth';
import riskRouter from './routes/risk';
import payeeRouter from './routes/payee';
import authRouter from './routes/auth';
import alertsRouter from './routes/alerts';

const app = express();

// ── Middleware ───────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(authMiddleware);

// ── Health check ────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'trustflow-api', version: '1.0.0' });
});

// ── Routes ──────────────────────────────────────────────────────────
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/risk', riskRouter);
app.use('/api/v1/payee', payeeRouter);
app.use('/api/v1/alerts', alertsRouter);

export default app;
