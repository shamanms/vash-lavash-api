import { Router } from 'express';
import products from './products';
import orders from './orders';
import vacancies from './vacancies';
import auth from './auth';

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

router.get(
  '/products/:id/image',
  products.validation.productGoogleImageUrlGet,
  products.routes.productGoogleImageUrlGet
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
