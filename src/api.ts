import express from 'express';
import cors from 'cors';

import router from './router';
import { validateProductsGet, validateProductsPut } from './router/validation';

export const app = express();
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://shamanms.com']
  })
);
app.use('/products', validateProductsGet);
app.use('/products', validateProductsPut);
app.use(router);
