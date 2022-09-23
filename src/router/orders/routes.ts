import { OrdersPost, OrdersGet } from './types';
import services from '../../services';

export const ordersPost: OrdersPost = async (req, res, next) => {
  try {
    const orderId = await services.order.addOrder(req.body);

    res.json({ orderId });
  } catch (e) {
    next(e);
  }
};

export const ordersGet: OrdersGet = async (req, res, next) => {
  try {
    const result = await services.order.getOrder();

    res.json(result);
  } catch (e) {
    next(e);
  }
};
