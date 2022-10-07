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
  auth.middlewares.adminAuth,
  products.validation.productGoogleImageUrlGet,
  products.routes.productGoogleImageUrlGet
);

router.get('/products/type', products.routes.productsTypeGet);

router.post('/orders', orders.validation.ordersPost, orders.routes.ordersPost);

router.post('/orders/glovo', orders.routes.glovoOrdersPost);

router.get('/orders', auth.middlewares.adminAuth, orders.routes.ordersGet);

// To have an ability to call from TG
router.get('/orders/:id', orders.validation.orderPut, orders.routes.orderPut);

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

router.put(
  '/vacancies/:id',
  vacancies.validation.vacancyCountPut,
  vacancies.routes.vacancyCountPut
);

export default router;
