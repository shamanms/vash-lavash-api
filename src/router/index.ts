import { Router } from 'express';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import services, { getProducts, addProducts, updateProducts } from '../services';
import {
  OrderRequest,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Product,
  TypedRequestBody,
  TypedRequestQuery
} from '../types';

const router = Router();

//TODO: add Validation and error handler
router.get(
  '/products',
  async (
    req: TypedRequestQuery<{ isAvailable: 'true' | 'false' }>,
    res,
    next
  ) => {
    try {
      // Proceed without filtering if flag not passed
      const { isAvailable } = req.query;
      if (
        'isAvailable' in req.query &&
        !['true', 'false'].includes(isAvailable)
      ) {
        return res.status(400).send();
      }
      const products = await getProducts({
        isAvailable: isAvailable ? isAvailable === 'true' : isAvailable
      });

      res.json(products);
    } catch (e) {
      next(e);
    }
  }
);

const verifyBody = function(req: any,res: any) {
  if (req !== typeof Array ) return res.status(400).send()
}
//TODO ADD AUTHORISATION for this POST /products

// router.post('/products', async (req: TypedRequestBody<Product[]>, res, next) => {
//   try {
//     await addProducts(req.body);

//     res.json({ status: "OK" });
//   } catch(e) {
//     next(e);
//   }
// });

router.put('/products', async (req: TypedRequestBody<Product[]>, res, next) => {
  try {
    verifyBody(req,res)
    const result = await updateProducts(req.body);

    res.json({ res })
    } catch(e) {
      next(e)
    }
})

router.post(
  '/orders',
  async (req: TypedRequestBody<Omit<OrderRequest, 'timestamp'>>, res, next) => {
    try {
      const service = services.order(req.body);
      const orderId = await service.addOrder();

      res.json({ orderId });
    } catch (e) {
      next(e);
    }
  }
);

export default router;
