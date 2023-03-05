import express from 'express';
import cors from 'cors';
import audit from 'express-requests-logger';

import router from './router';
import { errorHandler } from './router/errorHandler';

const { ALLOWED_DOMAINS } = process.env;

export const app = express();
const logger = audit({
  doubleAudit: true,
  request: {
    maskBody: ['password', 'token'],
    maskHeaders: ['Authorisation'],
    maskQuery: ['auth']
  },
  response: {
    maskBody: ['password', 'token'],
    maskHeaders: ['Authorisation']
  }
});

app.use(
  cors({
    origin: ALLOWED_DOMAINS?.split('|')
  })
);
app.use(logger);
app.use(router);
app.use(errorHandler);
