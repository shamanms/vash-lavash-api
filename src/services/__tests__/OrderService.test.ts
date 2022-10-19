import db from '../../models';
import { OrderService } from '../order';

jest.mock('../../models', () => ({
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
    findOneById: jest.fn()
  }
}));
const dateNow = Date.now();

describe('Class OrderService', () => {
  beforeEach(() => {
    jest.resetModules();
    global.Date.now = jest.fn(() => dateNow);
  });

  test('OrderService buildOrder() should return default', () => {
    const orderRequest = {
      items: { 123: 321 },
      phone: 'abc'
    };
    const service = new OrderService(db.orders, db.products);
    const expectedResult = {
      phone: orderRequest.phone,
      totalPrice: 0,
      orderStatus: 'not_confirmed',
      items: [],
      timestamp: dateNow
    };

    // @ts-ignore
    const result = service.buildOrder(orderRequest);

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
    const insertedDocument1 = {
      name: 'abc',
      price: 10
    };
    const insertedDocument2 = {
      name: 'zxc',
      price: 20
    };
    db.products.findOneById
      // @ts-ignore for test purposes
      .mockImplementationOnce(() => insertedDocument1)
      .mockImplementationOnce(() => insertedDocument2);
    const id = { id: '33' };
    // @ts-ignore for test purposes
    db.orders.insertOne.mockImplementation(() => id);
    const service = new OrderService(db.orders, db.products);

    const expectedResult = id.id;
    // @ts-ignore
    const result = await service.addOrder(orderRequest);

    expect(result).toEqual(expectedResult);
    expect(db.products.findOneById).toHaveBeenCalledTimes(2);
    expect(db.products.findOneById).toHaveBeenNthCalledWith(1, '123');
    expect(db.products.findOneById).toHaveBeenNthCalledWith(2, '456');
    expect(db.orders.insertOne).toHaveBeenCalledWith({
      phone: orderRequest.phone,
      totalPrice: 70,
      orderStatus: 'not_confirmed',
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
    db.products.findOneById
      // @ts-ignore for test purposes
      .mockImplementation(() => undefined);
    const service = new OrderService(db.orders, db.products);
    try {
      // @ts-ignore
      await service.addOrder(orderRequest);
    } catch (e: any) {
      expect(e?.message).toMatch(`Product with id: 123 not found`);
    }
  });
  test('OrderService getOrder() should called', async () => {
    const service = new OrderService(db.orders, db.products);
    await service.getOrder();
    expect(db.orders.findMany).toHaveBeenCalled();
  });
});
