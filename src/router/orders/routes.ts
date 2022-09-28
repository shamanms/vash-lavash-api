import { OrdersPost, OrdersGet, OrdersPut } from './types';
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

export const orderPut: OrdersPut = async (req, res, next) => {
  try {
    const result = await services.order.changeOrderStatus(
      req.params.id,
      req.query.status
    );

    res.json(result);
  } catch (e) {
    next(e);
  }
};
