import { Router } from 'express';
import products from './products';
import orders from './orders';
import vacancies from './vacancies';
import auth from './auth';
import sales from './sales';
import additives from './additives';
import labels from './labels';
import appConfig from './appConfig';
import categories from './categories';
import users from './users';
import comboMenus from './comboMenus';

const router = Router();

router.post('/login', auth.validation.loginPost, auth.routes.login);

router.get('/user', auth.middlewares.adminAuth, users.routes.getUser);

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

router.get('/sales', sales.validation.salesGet, sales.routes.salesGet);

router.post(
  '/sales',
  auth.middlewares.adminAuth,
  sales.validation.salesPost,
  sales.routes.salesPost
);

router.put(
  '/sales',
  auth.middlewares.adminAuth,
  sales.validation.salesPut,
  sales.routes.salesPut
);

router.get(
  '/sales/:id/image',
  auth.middlewares.adminAuth,
  sales.validation.salesGoogleImageUrlGet,
  sales.routes.salesGoogleImageUrlGet
);

router.get(
  '/additives',
  additives.validation.additivesGet,
  additives.routes.additivesGet
);

router.put(
  '/additives',
  auth.middlewares.adminAuth,
  additives.validation.additivesPut,
  additives.routes.additivesPut
);

router.post(
  '/additives',
  auth.middlewares.adminAuth,
  additives.validation.additivesPost,
  additives.routes.additivesPost
);

router.get(
  '/additives/:id/image',
  auth.middlewares.adminAuth,
  additives.validation.additiveGoogleImageUrlGet,
  additives.routes.additiveGoogleImageUrlGet
);

router.get('/labels', labels.routes.labelsGet);

router.post(
  '/labels',
  auth.middlewares.adminAuth,
  labels.validation.labelPost,
  labels.routes.labelPost
);

router.put(
  '/labels',
  auth.middlewares.adminAuth,
  labels.validation.labelsPut,
  labels.routes.labelsPut
);

router.get('/appConfig', appConfig.routes.appConfigGet);

router.put(
  '/appConfig',
  auth.middlewares.adminAuth,
  appConfig.validation.setIsOrderingAvailablePut,
  appConfig.routes.setIsOrderingAvailablePut
);

router.get('/categories', categories.routes.categoriesGet);

router.post(
  '/categories',
  auth.middlewares.adminAuth,
  categories.validation.categoryPost,
  categories.routes.categoryPost
);

router.put(
  '/categories/:categoryId',
  auth.middlewares.adminAuth,
  categories.validation.categoryPut,
  categories.routes.categoryPut
);

router.get('/comboMenus', comboMenus.routes.comboMenusGet);

router.put(
  '/comboMenus',
  auth.middlewares.adminAuth,
  comboMenus.validation.comboMenusPut,
  comboMenus.routes.comboMenusPut
);

router.post(
  '/comboMenus',
  auth.middlewares.adminAuth,
  comboMenus.validation.comboMenusPost,
  comboMenus.routes.comboMenusPost
);

router.get(
  '/comboMenus/:id/image',
  auth.middlewares.adminAuth,
  comboMenus.validation.comboMenuGoogleImageUrlGet,
  comboMenus.routes.comboMenuGoogleImageUrlGet
);

export default router;
