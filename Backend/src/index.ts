import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import vacationRoutes from './routes/vacationRoutes';
import aiRoutes from './routes/aiRoutes';
import mcpRoutes from './routes/mcpRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/vacations', vacationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/mcp', mcpRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Vacations API is running' });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  if (err.message === 'Only image files are allowed') {
    res.status(400).json({ message: err.message });
    return;
  }
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
