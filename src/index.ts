import express from 'express';
import cors from 'cors';

import router from './router';

const app = express();
app.use(cors({
  origin: ['http://localhost:3000', 'https://shamanms.com'],
}))
app.use(router)


// The main function export for cloud functions
export const api = app