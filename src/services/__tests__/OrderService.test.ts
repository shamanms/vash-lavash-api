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
  },
  comboMenus: {
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
    const service = new OrderService(
      db.orders,
      db.products,
      db.additives,
      db.comboMenus
    );
    const expectedResult = {
      phone: orderRequest.phone,
      totalPrice: 0,
      orderStatus: 'not_confirmed',
      items: [],
      comboMenus: [],
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
      comboMenus: [
        {
          comboMenuId: '555',
          isConstructor: false,
          fixedPrice: true,
          products: ['111', '222']
        },
        {
          comboMenuId: '666',
          isConstructor: true,
          fixedPrice: false,
          products: ['idOne', 'idTwo']
        }
      ],
      phone: 'abc',
      receivingTime: 123,
      delivery: 'home'
    };

    const insertedComboMenuDocument1 = {
      name: 'comboMenuName',
      price: 100,
      isConstructor: false,
      fixedPrice: true
    };
    const insertedComboMenuDocument2 = {
      name: 'constructorPizza',
      price: 0,
      isConstructor: true,
      fixedPrice: false
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
    const insertedProductDocument5 = {
      name: 'comboMenuProduct1',
      price: 10
    };
    const insertedProductDocument6 = {
      name: 'comboMenuProduct2',
      price: 10
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
      .mockImplementationOnce(() => insertedProductDocument4)
      .mockImplementationOnce(() => insertedProductDocument5)
      .mockImplementationOnce(() => insertedProductDocument6);
    db.additives.findOneById
      // @ts-ignore for test purposes
      .mockImplementationOnce(() => insertedAdditiveDocument1)
      .mockImplementationOnce(() => insertedAdditiveDocument2)
      .mockImplementationOnce(() => insertedAdditiveDocument1)
      .mockImplementationOnce(() => insertedAdditiveDocument2);
    db.comboMenus.findOneById
      // @ts-ignore for test purposes
      .mockImplementationOnce(() => insertedComboMenuDocument1)
      .mockImplementationOnce(() => insertedComboMenuDocument2);

    const id = { id: '33' };
    // @ts-ignore for test purposes
    db.orders.insertOne.mockImplementation(() => id);
    const service = new OrderService(
      db.orders,
      db.products,
      db.additives,
      db.comboMenus
    );

    const expectedResult = id.id;

    const result = await service.addOrder(orderRequest);

    expect(result).toEqual(expectedResult);
    expect(db.products.findOneById).toHaveBeenCalledTimes(6);
    expect(db.products.findOneById).toHaveBeenNthCalledWith(1, '123');
    expect(db.products.findOneById).toHaveBeenNthCalledWith(2, '123');
    expect(db.products.findOneById).toHaveBeenNthCalledWith(3, '123');
    expect(db.products.findOneById).toHaveBeenNthCalledWith(4, '456');
    expect(db.additives.findOneById).toHaveBeenCalledTimes(4);
    expect(db.additives.findOneById).toHaveBeenNthCalledWith(1, 'idOne');
    expect(db.additives.findOneById).toHaveBeenNthCalledWith(2, 'idTwo');
    expect(db.comboMenus.findOneById).toHaveBeenNthCalledWith(1, '555');
    expect(db.comboMenus.findOneById).toHaveBeenNthCalledWith(2, '666');
    expect(db.additives.findOneById).toHaveBeenNthCalledWith(3, 'idOne');
    expect(db.additives.findOneById).toHaveBeenNthCalledWith(4, 'idTwo');
    expect(db.orders.insertOne).toHaveBeenCalledWith(
      {
        phone: orderRequest.phone,
        totalPrice: 157,
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
        comboMenus: [
          {
            id: '555',
            name: 'comboMenuName',
            price: 100,
            products: [
              { id: '111', name: 'comboMenuProduct1', price: 10 },
              { id: '222', name: 'comboMenuProduct2', price: 10 }
            ]
          },
          {
            id: '666',
            name: 'constructorPizza',
            price: 3,
            products: [
              { id: 'idOne', name: 'cba', price: 1 },
              { id: 'idTwo', name: 'cxz', price: 2 }
            ]
          }
        ],
        timestamp: dateNow,
        receivingTime: 123
      },
      'user'
    );
  });
  test('OrderService addOrder() should throw error "Additive with id: id not found"', async () => {
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
      comboMenus: [],
      receivingTime: 123,
      delivery: null
    };
    db.products.findOneById
      // @ts-ignore for test purposes
      .mockImplementation(() => '123');
    // @ts-ignore for test purposes
    db.additives.findOneById.mockImplementation(() => undefined);
    const service = new OrderService(
      db.orders,
      db.products,
      db.additives,
      db.comboMenus
    );
    try {
      await service.addOrder(orderRequest);
    } catch (e: any) {
      expect(e?.message).toMatch(`Additive with id: id not found`);
    }
  });
  test('OrderService addOrder() should throw error "Product with id: 123 not found"', async () => {
    const orderRequest = {
      items: [
        {
          productId: '123',
          additives: {
            id: 1
          }
        }
      ],
      comboMenus: [],
      phone: 'abc',
      receivingTime: 123,
      delivery: null
    };
    db.products.findOneById
      // @ts-ignore for test purposes
      .mockImplementation(() => undefined);
    // @ts-ignore for test purposes
    db.additives.findOneById.mockImplementation(() => 'id');
    const service = new OrderService(
      db.orders,
      db.products,
      db.additives,
      db.comboMenus
    );
    try {
      await service.addOrder(orderRequest);
    } catch (e: any) {
      expect(e?.message).toMatch(`Product with id: 123 not found`);
    }
  });
  test('OrderService addOrder() should throw error "ComboMenu with id: 123 not found"', async () => {
    const orderRequest = {
      items: [
        {
          productId: '123',
          additives: {
            idOne: 1
          }
        }
      ],
      comboMenus: [
        {
          comboMenuId: 'id',
          isConstructor: false,
          fixedPrice: true,
          products: ['123']
        }
      ],
      phone: 'abc',
      receivingTime: 123,
      delivery: null
    };
    const insertedAdditiveDocument = {
      name: 'cba',
      price: 1
    };
    const insertedProductDocument = {
      name: 'abc',
      price: 10
    };
    db.products.findOneById
      // @ts-ignore for test purposes
      .mockImplementationOnce(() => insertedProductDocument)
      .mockImplementationOnce(() => insertedProductDocument);
    // @ts-ignore for test purposes
    db.additives.findOneById.mockImplementation(() => insertedAdditiveDocument);
    // @ts-ignore for test purposes
    db.comboMenus.findOneById.mockImplementation(() => undefined);
    const service = new OrderService(
      db.orders,
      db.products,
      db.additives,
      db.comboMenus
    );
    try {
      await service.addOrder(orderRequest);
    } catch (e: any) {
      expect(e?.message).toMatch(`ComboMenu with id: id not found`);
    }
  });
  test('OrderService addOrder() should throw error "Product with id: 333 not found"', async () => {
    const orderRequest = {
      items: [
        {
          productId: '123',
          additives: {
            idOne: 1
          }
        }
      ],
      comboMenus: [
        {
          comboMenuId: 'id',
          isConstructor: false,
          fixedPrice: true,
          products: ['333']
        }
      ],
      phone: 'abc',
      receivingTime: 123,
      delivery: null
    };
    const insertedAdditiveDocument = {
      name: 'cba',
      price: 1
    };
    const insertedProductDocument = {
      name: 'abc',
      price: 10
    };
    const insertedComboMenuDocument = {
      name: 'comboMenuName',
      isConstructor: false,
      price: 100
    };
    db.products.findOneById
      // @ts-ignore for test purposes
      .mockImplementationOnce(() => insertedProductDocument)
      .mockImplementationOnce(() => undefined);
    // @ts-ignore for test purposes
    db.additives.findOneById.mockImplementation(() => insertedAdditiveDocument);
    // @ts-ignore for test purposes
    db.comboMenus.findOneById.mockImplementation(
      () => insertedComboMenuDocument
    );
    const service = new OrderService(
      db.orders,
      db.products,
      db.additives,
      db.comboMenus
    );
    try {
      await service.addOrder(orderRequest);
    } catch (e: any) {
      expect(e?.message).toMatch(`Product with id: 333 not found`);
    }
  });
  test('OrderService addOrder() should throw error "Additive with id: 333 not found"', async () => {
    const orderRequest = {
      items: [
        {
          productId: '123',
          additives: {
            idOne: 1
          }
        }
      ],
      comboMenus: [
        {
          comboMenuId: 'id',
          isConstructor: true,
          fixedPrice: false,
          products: ['333']
        }
      ],
      phone: 'abc',
      receivingTime: 123,
      delivery: null
    };
    const insertedAdditiveDocument = {
      name: 'cba',
      price: 1
    };
    const insertedProductDocument = {
      name: 'abc',
      price: 10
    };
    const insertedComboMenuDocument = {
      name: 'comboMenuName',
      isConstructor: false,
      price: 0
    };
    db.products.findOneById
      // @ts-ignore for test purposes
      .mockImplementationOnce(() => insertedProductDocument);
    db.additives.findOneById
      // @ts-ignore for test purposes
      .mockImplementationOnce(() => insertedAdditiveDocument)
      .mockImplementationOnce(() => undefined);
    // @ts-ignore for test purposes
    db.comboMenus.findOneById.mockImplementation(
      () => insertedComboMenuDocument
    );
    const service = new OrderService(
      db.orders,
      db.products,
      db.additives,
      db.comboMenus
    );
    try {
      await service.addOrder(orderRequest);
    } catch (e: any) {
      expect(e?.message).toMatch(`Additive with id: 333 not found`);
    }
  });
  test('OrderService getOrder() should called', async () => {
    const service = new OrderService(
      db.orders,
      db.products,
      db.additives,
      db.comboMenus
    );
    await service.getOrder();
    expect(db.orders.findMany).toHaveBeenCalled();
  });
});
