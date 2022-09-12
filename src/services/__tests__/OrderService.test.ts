import { Model } from '../../models';
import { OrderModel, Product } from '../../types';
import { OrderService } from '../order';

// @ts-ignore for test purposes
const db = {
  orders: {
    insertOne: jest.fn(),
    insertMany: jest.fn(),
    findMany: jest.fn(),
    findOne: jest.fn()
  },
  products: {
    insertOne: jest.fn(),
    insertMany: jest.fn(),
    findMany: jest.fn(),
    findOne: jest.fn()
  }
} as { orders: Model<OrderModel>; products: Model<Product> };
const dateNow = 1530518207007;

describe('Class OrderService', () => {
  beforeEach(() => {
    jest.resetModules();
    global.Date.now = jest.fn(() => 1530518207007);
  });

  test('OrderService buildOrder() should return default', () => {
    const orderRequest = {
      items: { 123: 321 },
      phone: 'abc'
    };
    const service = new OrderService(db.orders, db.products, orderRequest);
    const expectedResult = {
      phone: orderRequest.phone,
      totalPrice: 0,
      isConfirmed: false,
      isCompleted: false,
      items: [],
      timestamp: dateNow
    };

    const result = service.buildOrder();

    expect(result).toEqual(expectedResult);
  });

  test('OrderService addOrder() should return id', async () => {
    const orderRequest = {
      items: {
        123: 1,
        456: 3
      },
      phone: 'abc'
    };
    const product1 = {
      name: 'abc',
      price: 10
    };
    const product2 = {
      name: 'zxc',
      price: 20
    };
    db.products.findOne
      // @ts-ignore for test purposes
      .mockImplementationOnce(() => product1)
      .mockImplementationOnce(() => product2);
    const id = { id: '33' };
    // @ts-ignore for test purposes
    db.orders.insertOne.mockImplementation(() => id);
    const service = new OrderService(db.orders, db.products, orderRequest);

    const expectedResult = id.id;
    const result = await service.addOrder();

    expect(result).toEqual(expectedResult);
    expect(db.products.findOne).toHaveBeenCalledTimes(2);
    expect(db.products.findOne).toHaveBeenNthCalledWith(1, '123');
    expect(db.products.findOne).toHaveBeenNthCalledWith(2, '456');
    expect(db.orders.insertOne).toHaveBeenCalledWith({
      phone: orderRequest.phone,
      totalPrice: 70,
      isConfirmed: false,
      isCompleted: false,
      items: [
        { name: 'abc', price: 10, count: 1, id: '123' },
        { name: 'zxc', price: 20, count: 3, id: '456' }
      ],
      timestamp: dateNow
    });
  });
  test('OrderService addOrder() should return error', async () => {
    const orderRequest = {
      items: {
        123: 1,
        456: 3
      },
      phone: 'abc'
    };
    db.products.findOne
      // @ts-ignore for test purposes
      .mockImplementationOnce(() => undefined)
      .mockImplementationOnce(() => false);
    const service = new OrderService(db.orders, db.products, orderRequest);
    try {
      await service.addOrder();
    } catch (e: any) {
      expect(e?.message).toMatch(`Product with id: 123 not found`);
    }
  });
});
