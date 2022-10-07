import db from '../../models';
import { GlovoOrderRequest } from '../../types';
import services from '../index';

jest.mock('../../models', () => ({
  orders: {
    insertOne: jest.fn(() => ({
      id: '1'
    }))
  }
}));

describe('service.addGlovoOrder', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  test('when called with phone should add in db order with phone and return id', async () => {
    const glovoProduct1 = {
      name: 'lavash',
      price: 1,
      quantity: 1
    };
    const glovoProduct2 = {
      name: 'bilka',
      price: 2,
      quantity: 1
    };
    const glovoOrderRequest: GlovoOrderRequest = {
      order_id: 'id',
      order_time: '2022-04-04 10:10',
      customer: {
        phone_number: '0990'
      },
      products: [glovoProduct1, glovoProduct2],
      pick_up_code: '123'
    };
    const order = {
      phone: glovoOrderRequest.customer?.phone_number,
      orderStatus: 'confirmed',
      items: [
        {
          name: 'lavash',
          price: 1,
          count: 1
        },
        {
          name: 'bilka',
          price: 2,
          count: 1
        }
      ],
      timestamp: Date.parse(glovoOrderRequest.order_time),
      glovoOrderId: glovoOrderRequest.order_id,
      pickUpCode: glovoOrderRequest.pick_up_code,
      totalPrice: 3
    };

    const result = await services.order.addGlovoOrder(glovoOrderRequest);

    expect(db.orders.insertOne).toHaveBeenCalledWith(order);
    expect(result).toEqual('1');
  });
  test('when called without phone should add in db order phone to be "" and return id', async () => {
    const glovoProduct1 = {
      name: 'lavash',
      price: 1,
      quantity: 1
    };
    const glovoProduct2 = {
      name: 'bilka',
      price: 2,
      quantity: 1
    };
    const glovoOrderRequest: GlovoOrderRequest = {
      order_id: 'id',
      order_time: '2022-04-04 10:10',
      products: [glovoProduct1, glovoProduct2],
      pick_up_code: '123'
    };
    const order = {
      phone: '',
      orderStatus: 'confirmed',
      items: [
        {
          name: 'lavash',
          price: 1,
          count: 1
        },
        {
          name: 'bilka',
          price: 2,
          count: 1
        }
      ],
      timestamp: Date.parse(glovoOrderRequest.order_time),
      glovoOrderId: glovoOrderRequest.order_id,
      pickUpCode: glovoOrderRequest.pick_up_code,
      totalPrice: 3
    };

    const result = await services.order.addGlovoOrder(glovoOrderRequest);

    expect(db.orders.insertOne).toHaveBeenCalledWith(order);
    expect(result).toEqual('1');
  });
});
