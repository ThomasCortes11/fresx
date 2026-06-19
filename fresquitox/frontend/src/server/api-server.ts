/**
 * Servidor API solo para desarrollo local (ng serve + proxy).
 * En producción la API vive en server.ts junto al SSR.
 */
import express from 'express';
import { initDatabase } from './db/index';
import apiRouter from './api/router';

const app = express();
const port = Number(process.env['API_PORT'] ?? 4001);

initDatabase();

app.use(express.json({ limit: '10mb' }));
app.use('/api', apiRouter);

app.listen(port, () => {
  console.log(`[fresquitox] API dev → http://localhost:${port}/api/health`);
});
