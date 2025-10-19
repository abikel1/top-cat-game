import './config/env.js';
import express from 'express';
import cors from 'cors';
import { pool } from './db/pool.js';
import usersRouter from './routes/usersRoutes.js';

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// בדיקת חיבור ל-DB
app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.use('/api/users', usersRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`✅ Server listening on http://localhost:${port}`));
