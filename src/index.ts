import express from 'express';
import router from './router';

const app = express();
app.use(router)


// The main function export for cloud functions
export const api = app