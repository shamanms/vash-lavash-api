import db from '../../models';
import { OrderService } from '../order';
import { OrderRequest } from '../../types';

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
  },
  additives: {
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
      items: [
        {
          productId: '123',
          count: 1,
          additives: {
            id: 1
          }
        }
      ],
      phone: 'abc',
      receivingTime: 123,
      delivery: 'home'
    };
    const service = new OrderService(db.orders, db.products, db.additives);
    const expectedResult = {
      phone: orderRequest.phone,
      totalPrice: 0,
      orderStatus: 'not_confirmed',
      items: [],
      timestamp: dateNow,
      receivingTime: 123,
      delivery: 'home'
    };

    const result = service.buildOrder(orderRequest);

    expect(result).toEqual(expectedResult);
  });

  test('OrderService addOrder() should return id', async () => {
    const orderRequest: OrderRequest = {
      items: [
        {
          productId: '123',
          additives: {
            idOne: 2
          }
        },
        { productId: '123', additives: {} },
        { productId: '123', additives: {} },
        {
          productId: '456',
          additives: {
            idTwo: 1
          }
        }
      ],
      phone: 'abc',
      receivingTime: 123,
      delivery: 'home'
    };
    const insertedProductDocument1 = {
      name: 'abc',
      price: 10
    };
    const insertedProductDocument2 = {
      name: 'abc',
      price: 10
    };
    const insertedProductDocument3 = {
      name: 'abc',
      price: 10
    };
    const insertedProductDocument4 = {
      name: 'zxc',
      price: 20
    };
    const insertedAdditiveDocument1 = {
      name: 'cba',
      price: 1
    };
    const insertedAdditiveDocument2 = {
      name: 'cxz',
      price: 2
    };
    db.products.findOneById
      // @ts-ignore for test purposes
      .mockImplementationOnce(() => insertedProductDocument1)
      .mockImplementationOnce(() => insertedProductDocument2)
      .mockImplementationOnce(() => insertedProductDocument3)
      .mockImplementationOnce(() => insertedProductDocument4);
    db.additives.findOneById
      // @ts-ignore for test purposes
      .mockImplementationOnce(() => insertedAdditiveDocument1)
      .mockImplementationOnce(() => insertedAdditiveDocument2);
    const id = { id: '33' };
    // @ts-ignore for test purposes
    db.orders.insertOne.mockImplementation(() => id);
    const service = new OrderService(db.orders, db.products, db.additives);

    const expectedResult = id.id;

    const result = await service.addOrder(orderRequest);

    expect(result).toEqual(expectedResult);
    expect(db.products.findOneById).toHaveBeenCalledTimes(4);
    expect(db.products.findOneById).toHaveBeenNthCalledWith(1, '123');
    expect(db.products.findOneById).toHaveBeenNthCalledWith(2, '123');
    expect(db.products.findOneById).toHaveBeenNthCalledWith(3, '123');
    expect(db.products.findOneById).toHaveBeenNthCalledWith(4, '456');
    expect(db.additives.findOneById).toHaveBeenCalledTimes(2);
    expect(db.additives.findOneById).toHaveBeenNthCalledWith(1, 'idOne');
    expect(db.additives.findOneById).toHaveBeenNthCalledWith(2, 'idTwo');
    expect(db.orders.insertOne).toHaveBeenCalledWith(
      {
        phone: orderRequest.phone,
        totalPrice: 54,
        delivery: orderRequest.delivery,
        orderStatus: 'not_confirmed',
        items: [
          {
            name: 'abc',
            price: 10,
            id: '123',
            additives: [{ name: 'cba', price: 1, count: 2, id: 'idOne' }]
          },
          {
            name: 'abc',
            price: 10,
            id: '123',
            additives: []
          },
          {
            name: 'abc',
            price: 10,
            id: '123',
            additives: []
          },
          {
            name: 'zxc',
            price: 20,
            id: '456',
            additives: [{ name: 'cxz', price: 2, count: 1, id: 'idTwo' }]
          }
        ],
        timestamp: dateNow,
        receivingTime: 123
      },
      'user'
    );
  });
  test('OrderService addOrder() should throw error', async () => {
    const orderRequest = {
      items: [
        {
          productId: '123',
          additives: {
            id: 1
          }
        }
      ],
      phone: 'abc',
      receivingTime: 123,
      delivery: null
    };
    db.products.findOneById
      // @ts-ignore for test purposes
      .mockImplementation(() => '123');
    // @ts-ignore for test purposes
    db.additives.findOneById.mockImplementation(() => undefined);
    const service = new OrderService(db.orders, db.products, db.additives);
    try {
      await service.addOrder(orderRequest);
    } catch (e: any) {
      expect(e?.message).toMatch(`Additive with id: id not found`);
    }
  });
  test('OrderService addOrder() should throw error', async () => {
    const orderRequest = {
      items: [
        {
          productId: '123',
          additives: {
            id: 1
          }
        }
      ],
      phone: 'abc',
      receivingTime: 123,
      delivery: null
    };
    db.products.findOneById
      // @ts-ignore for test purposes
      .mockImplementation(() => undefined);
    // @ts-ignore for test purposes
    db.additives.findOneById.mockImplementation(() => 'id');
    const service = new OrderService(db.orders, db.products, db.additives);
    try {
      await service.addOrder(orderRequest);
    } catch (e: any) {
      expect(e?.message).toMatch(`Product with id: 123 not found`);
    }
  });
  test('OrderService getOrder() should called', async () => {
    const service = new OrderService(db.orders, db.products, db.additives);
    await service.getOrder();
    expect(db.orders.findMany).toHaveBeenCalled();
  });
});
