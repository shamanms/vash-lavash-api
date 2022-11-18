import express from 'express';
import cors from 'cors';

import router from './router';
import { errorHandler } from './router/errorHandler';

const { ALLOWED_DOMAINS } = process.env;

export const app = express();
app.use(
  cors({
    origin: ALLOWED_DOMAINS?.split('|')
  })
);
app.use(router);
app.use(errorHandler);
