import express from 'express';
import cors from 'cors';

import router from './router';
import { errorHandler } from './router/errorHandler';

export const app = express();
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://shamanms.com']
  })
);
app.use(router);
app.use(errorHandler);
