import express, { Application } from 'express';
import cors from 'cors';

import productRoutes from './routes/productRoutes';
import marcaRoutes from './routes/marcaRoutes';
import tipoRoutes from './routes/tipoRoutes';
import categoriaRoutes from './routes/categoriaRoutes';
import supermercadoRoutes from './routes/supermercadoRoutes';
import supermercados_productosRoutes from './routes/supermercadosProductosRoutes';

require('dotenv').config();

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use('/api', productRoutes);
app.use('/api', marcaRoutes);
app.use('/api', tipoRoutes);
app.use('/api', categoriaRoutes);
app.use('/api', supermercadoRoutes);
app.use('/api', supermercados_productosRoutes);

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
