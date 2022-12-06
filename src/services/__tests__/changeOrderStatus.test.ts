import services from '../index';
import { OrderStatus } from '../../types';
import db from '../../models';

jest.mock('../../models', () => ({
  orders: {
    updateOne: jest.fn(() => '123')
  }
}));

describe('service.changeOrderStatus', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  test('when called with orderId and userId and orderStatus should return orderId ', async () => {
    const orderId = '123';
    const orderStatus: OrderStatus = OrderStatus.COMPLETED;
    const result = await services.order.changeOrderStatus(
      orderId,
      orderStatus,
      'vasyaId'
    );
    expect(db.orders.updateOne).toHaveBeenCalledWith(
      orderId,
      { orderStatus },
      'vasyaId'
    );
    expect(result).toEqual('123');
  });
  test('when called with orderId and without UserId and orderStatus should return orderId ', async () => {
    const orderId = '123';
    const orderStatus: OrderStatus = OrderStatus.CONFIRMED;
    const result = await services.order.changeOrderStatus(orderId, orderStatus);
    expect(db.orders.updateOne).toHaveBeenCalledWith(
      orderId,
      { orderStatus },
      undefined
    );
    expect(result).toEqual('123');
  });
});
