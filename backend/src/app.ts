import express, { Application } from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes';
import marcaRoutes from './routes/marcaRoutes';

require('dotenv').config();

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use('/api', productRoutes);
app.use('/api', marcaRoutes);

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
