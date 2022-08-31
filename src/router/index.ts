import { Router } from 'express';
import { getProducts, addOrder } from "../services";

const router = Router();

router.get('/products', async (req, res, next) => {
  try {
    const products = await getProducts();

    await res.json(products);
  } catch(e) {
    next(e);
  }
});

router.post('/orders', async (req, res, next) => {
  try {
    const orderId = await addOrder(req.body);

    await res.json({ orderId });
  } catch(e) {
    next(e);
  }
});

export default router;