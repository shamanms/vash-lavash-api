import { orderNotification as orderNotificationFunc } from './services/orderNotification';
import { app } from './api';

// The main function export for cloud functions
export const api = app;
export const orderNotification = orderNotificationFunc;
