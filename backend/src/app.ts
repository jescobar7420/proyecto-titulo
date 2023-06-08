import express, { Application } from 'express';
import cors from 'cors';

import productRoutes from './routes/productRoutes';
import marcaRoutes from './routes/marcaRoutes';
import tipoRoutes from './routes/tipoRoutes';
import categoriaRoutes from './routes/categoriaRoutes';
import supermercadoRoutes from './routes/supermercadoRoutes';
import supermercados_productosRoutes from './routes/supermercadosProductosRoutes';
import auth from './routes/authRoutes';

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
app.use('/api', auth);

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const HOSTNAME_SV: string = process.env.HOSTNAME_SV || 'localhost'; 

app.listen(PORT, () => {
  console.log(`Server listening on ${HOSTNAME_SV}:${PORT}`);
});
