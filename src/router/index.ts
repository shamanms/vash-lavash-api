import { Router } from 'express';
import services from '../services';
import {
  OrderRequest,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Product,
  TypedRequestBody,
  TypedRequestQuery
} from '../types';
import {
  validateOrdersPost,
  validateProductsGet,
  validateProductsPut
} from './validation';

const router = Router();

router.get(
  '/products',
  validateProductsGet,
  async (
    req: TypedRequestQuery<{ isAvailable: 'true' | 'false' }>,
    res,
    next
  ) => {
    try {
      // Proceed without filtering if flag not passed
      const { isAvailable } = req.query;
      const products = await services.products.getProducts({
        isAvailable: isAvailable ? isAvailable === 'true' : isAvailable
      });

      res.json(products);
    } catch (e) {
      next(e);
    }
  }
);

//TODO ADD AUTHORISATION for this POST /products

// router.post('/products', async (req: TypedRequestBody<Product[]>, res, next) => {
//   try {
//     await services.products.addProducts(req.body);

//     res.json({ status: "OK" });
//   } catch(e) {
//     next(e);
//   }
// });

router.put(
  '/products',
  validateProductsPut,
  async (req: TypedRequestBody<Product[]>, res, next) => {
    try {
      const result = await services.products.updateProducts(req.body);

      res.json(result);
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  '/orders',
  validateOrdersPost,
  async (req: TypedRequestBody<Omit<OrderRequest, 'timestamp'>>, res, next) => {
    try {
      const orderId = await services.order.addOrder(req.body);

      res.json({ orderId });
    } catch (e) {
      next(e);
    }
  }
);

router.get('/orders', async (req, res, next) => {
  try {
    const result = await services.order.getOrder();

    res.json(result);
  } catch (e) {
    next(e);
  }
});

export default router;
