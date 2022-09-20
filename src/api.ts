import express from 'express';
import cors from 'cors';

import router from './router';

export const app = express();
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://shamanms.com']
  })
);
app.use(router);
