import { Router } from 'express';
import products from './products';
import orders from './orders';
import vacancies from './vacancies';

const router = Router();

router.get(
  '/products',
  products.validation.productsGet,
  products.routes.productsGet
);

router.put(
  '/products',
  products.validation.productsPut,
  products.routes.productsPut
);

//TODO ADD AUTHORISATION for this POST and PUT /products and GET /orders

// router.post('/products', async (req: TypedRequestBody<Product[]>, res, next) => {
//   try {
//     await services.products.addProducts(req.body);

//     res.json({ status: "OK" });
//   } catch(e) {
//     next(e);
//   }
// });

router.post('/orders', orders.validation.ordersPost, orders.routes.ordersPost);

router.get('/orders', orders.routes.ordersGet);

router.get('/vacancies', vacancies.routes.vacanciesGet);

router.put('/vacancies', vacancies.routes.vacanciesPut);

router.post('/vacancies', vacancies.routes.vacanciesPost);

export default router;
