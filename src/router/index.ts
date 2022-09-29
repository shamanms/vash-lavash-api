import { Router } from 'express';
import products from './products';
import orders from './orders';
import vacancies from './vacancies';
import auth from './auth';
import db from '../models';
import { OrderStatus } from '../types';

const router = Router();

router.post('/login', auth.validation.loginPost, auth.routes.login);

router.get(
  '/products',
  products.validation.productsGet,
  products.routes.productsGet
);

router.put(
  '/products',
  auth.middlewares.adminAuth,
  products.validation.productsPut,
  products.routes.productsPut
);

router.post(
  '/products',
  auth.middlewares.adminAuth,
  products.validation.productsPost,
  products.routes.productsPost
);

router.post('/orders', orders.validation.ordersPost, orders.routes.ordersPost);

router.get('/orders', auth.middlewares.adminAuth, orders.routes.ordersGet);

router.put('/orders/:id', orders.validation.orderPut, orders.routes.orderPut);

router.get(
  '/vacancies',
  vacancies.validation.vacanciesGet,
  vacancies.routes.vacanciesGet
);

router.put(
  '/vacancies',
  auth.middlewares.adminAuth,
  vacancies.validation.vacanciesPut,
  vacancies.routes.vacanciesPut
);

router.post(
  '/vacancies',
  auth.middlewares.adminAuth,
  vacancies.validation.vacanciesPost,
  vacancies.routes.vacanciesPost
);

export default router;

router.put('/orders', async (req, res, next) => {
  const a = await db.orders.findMany();
  for (const order of a) {
    await db.orders.updateOne(order.id, { orderStatus: OrderStatus.CONFIRMED });
  }
  res.json({});
  next();
});
