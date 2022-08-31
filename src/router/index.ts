import { Router } from 'express';
import { getProducts, addOrder, addProducts } from "../services";
import { Order, Product, TypedRequestBody } from "../types";

const router = Router();

//TODO: add Validation and error handler
router.get('/products', async (req, res, next) => {
  try {
    const products = await getProducts();

    res.json(products);
  } catch(e) {
    next(e);
  }
});

//TODO ADD AUTHORISATION for this POST /products

// router.post('/products', async (req: TypedRequestBody<Product[]>, res, next) => {
//   try {
//     await addProducts(req.body);
//
//     res.json({ status: "OK" });
//   } catch(e) {
//     next(e);
//   }
// });

router.post('/orders', async (req: TypedRequestBody<Omit<Order, 'timestamp'>>, res, next) => {
  try {
    const orderId = await addOrder(req.body);

    res.json({ orderId });
  } catch(e) {
    next(e);
  }
});

export default router;