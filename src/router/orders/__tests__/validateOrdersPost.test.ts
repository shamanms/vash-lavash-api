import { ValidationError } from '../../../models/errors';
import { ordersPost } from '../validation';
import db from '../../../models';

const next = jest.fn();
const res = {};
let additives = [
  {
    id: '1',
    name: 'sol',
    price: 1,
    img: '',
    isAvailable: true
  },
  {
    id: '2',
    name: 'perec',
    price: 2,
    img: '',
    isAvailable: true
  }
];
let productOne = {
  id: '13',
  type: 'Випічка дріжджова',
  img: '',
  price: 18,
  isAvailable: true,
  description: '',
  name: 'Гурулі з цибулею',
  additives: ['1', '2']
};
let productTwo = {
  id: '11',
  description: '',
  img: '',
  isAvailable: true,
  price: 15,
  type: 'Солодка випічка',
  name: 'Пеновані з шоколадом та горіхами',
  additives: ['1', '2']
};
jest.mock('../../../models', () => ({
  products: {
    findOneById: jest.fn()
  },
  additives: {
    findMany: jest.fn(() => Promise.resolve(additives))
  }
}));

describe('ordersPost', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });
  test('when order don`t have additives should go next', async () => {
    db.products.findOneById
      // @ts-ignore for test purposes
      .mockImplementationOnce(() => productOne)
      .mockImplementationOnce(() => productTwo);
    // @ts-ignore for test purposes
    db.additives.findMany.mockImplementation(() => Promise.resolve(additives));
    const req = {
      body: {
        items: [
          {
            productId: productOne.id
          },
          {
            productId: productTwo.id
          }
        ],
        phone: '(000) 465-45-23',
        receivingTime: new Date().setHours(12, 10, 15)
      }
    };
    // @ts-ignore for test purposes
    await ordersPost(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0]).toHaveLength(0);
  });
  test('when order correct and receiving time today should go next', async () => {
    db.products.findOneById
      // @ts-ignore for test purposes
      .mockImplementationOnce(() => productOne)
      .mockImplementationOnce(() => productTwo);
    // @ts-ignore for test purposes
    db.additives.findMany.mockImplementation(() => Promise.resolve(additives));
    const req = {
      body: {
        items: [
          {
            productId: productOne.id,
            additives: { [additives[0].id]: 2, [additives[1].id]: 1 }
          },
          {
            productId: productTwo.id,
            additives: {}
          }
        ],
        phone: '(000) 465-45-23',
        receivingTime: new Date().setHours(12, 10, 15)
      }
    };
    // @ts-ignore for test purposes
    await ordersPost(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0]).toHaveLength(0);
  });
  test('when order correct and receiving time tomorrow should go next', async () => {
    db.products.findOneById
      // @ts-ignore for test purposes
      .mockImplementationOnce(() => productOne)
      .mockImplementationOnce(() => productTwo);
    // @ts-ignore for test purposes
    db.additives.findMany.mockImplementation(() => Promise.resolve(additives));
    const req = {
      body: {
        items: [
          {
            productId: productOne.id,
            additives: { [additives[0].id]: 2, [additives[1].id]: 1 }
          },
          {
            productId: productTwo.id,
            additives: {}
          }
        ],
        phone: '(000) 465-45-23',
        receivingTime: new Date(
          new Date().setDate(new Date().getDate() + 1)
        ).setHours(10, 20, 21)
      }
    };
    // @ts-ignore for test purposes
    await ordersPost(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0]).toHaveLength(0);
  });
  test('when order receivingTime not number should throw "Invalid date format"', async () => {
    db.products.findOneById
      // @ts-ignore for test purposes
      .mockImplementationOnce(() => productOne)
      .mockImplementationOnce(() => productTwo);
    const req = {
      body: {
        items: [
          {
            productId: productOne.id,
            additives: { [additives[0].id]: 2, [additives[1].id]: 1 }
          },
          {
            productId: productTwo.id,
            additives: {}
          }
        ],
        phone: '(000) 465-45-23',
        receivingTime: '10'
      }
    };
    const error = new ValidationError('Invalid date format');

    // @ts-ignore for test purposes
    await ordersPost(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0]).toEqual([error]);
  });
  test('when order receivingTime yesterday should throw "Invalid order date"', async () => {
    db.products.findOneById
      // @ts-ignore for test purposes
      .mockImplementationOnce(() => productOne)
      .mockImplementationOnce(() => productTwo);
    const req = {
      body: {
        items: [
          {
            productId: productOne.id,
            additives: { [additives[0].id]: 2, [additives[1].id]: 1 }
          },
          {
            productId: productTwo.id,
            additives: {}
          }
        ],
        phone: '(000) 465-45-23',
        receivingTime: new Date(
          new Date().setDate(new Date().getDate() - 1)
        ).setHours(11, 20, 21)
      }
    };

    const error = new ValidationError('Invalid order date');

    // @ts-ignore for test purposes
    await ordersPost(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0]).toEqual([error]);
  });
  test('when order receivingTime after tomorrow should throw "Invalid order date"', async () => {
    db.products.findOneById
      // @ts-ignore for test purposes
      .mockImplementationOnce(() => productOne)
      .mockImplementationOnce(() => productTwo);
    const req = {
      body: {
        items: [
          {
            productId: productOne.id,
            additives: { [additives[0].id]: 2, [additives[1].id]: 1 }
          },
          {
            productId: productTwo.id,
            additives: {}
          }
        ],
        phone: '(000) 465-45-23',
        receivingTime: new Date(
          new Date().setDate(new Date().getDate() + 2)
        ).setHours(11, 20, 21)
      }
    };

    const error = new ValidationError('Invalid order date');

    // @ts-ignore for test purposes
    await ordersPost(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0]).toEqual([error]);
  });
  test('when order receivingTime after timeClose should throw "Invalid order time"', async () => {
    db.products.findOneById
      // @ts-ignore for test purposes
      .mockImplementationOnce(() => productOne)
      .mockImplementationOnce(() => productTwo);
    const req = {
      body: {
        items: [
          {
            productId: productOne.id,
            additives: { [additives[0].id]: 2, [additives[1].id]: 1 }
          },
          {
            productId: productTwo.id,
            additives: {}
          }
        ],
        phone: '(000) 465-45-23',
        receivingTime: new Date().setHours(19, 0, 1)
      }
    };

    const error = new ValidationError('Invalid order time');

    // @ts-ignore for test purposes
    await ordersPost(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0]).toEqual([error]);
  });
  test('when order receivingTime before timeOpen should throw "Invalid order time"', async () => {
    db.products.findOneById
      // @ts-ignore for test purposes
      .mockImplementationOnce(() => productOne)
      .mockImplementationOnce(() => productTwo);
    const req = {
      body: {
        items: [
          {
            productId: productOne.id,
            additives: { [additives[0].id]: 2, [additives[1].id]: 1 }
          },
          {
            productId: productTwo.id,
            additives: {}
          }
        ],
        phone: '(000) 465-45-23',
        receivingTime: new Date().setHours(9, 59, 59)
      }
    };

    const error = new ValidationError('Invalid order time');

    // @ts-ignore for test purposes
    await ordersPost(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0]).toEqual([error]);
  });
  test('when order receivingTime before timeOpen next day should throw "Invalid order time"', async () => {
    db.products.findOneById
      // @ts-ignore for test purposes
      .mockImplementationOnce(() => productOne)
      .mockImplementationOnce(() => productTwo);
    const req = {
      body: {
        items: [
          {
            productId: productOne.id,
            additives: { [additives[0].id]: 2, [additives[1].id]: 1 }
          },
          {
            productId: productTwo.id,
            additives: {}
          }
        ],
        phone: '(000) 465-45-23',
        receivingTime: new Date(
          new Date().setDate(new Date().getDate() + 1)
        ).setHours(9, 59, 59)
      }
    };

    const error = new ValidationError('Invalid order time');

    // @ts-ignore for test purposes
    await ordersPost(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0]).toEqual([error]);
  });
  test('when order receivingTime after timeClose next day should throw "Invalid order time"', async () => {
    db.products.findOneById
      // @ts-ignore for test purposes
      .mockImplementationOnce(() => productOne)
      .mockImplementationOnce(() => productTwo);
    const req = {
      body: {
        items: [
          {
            productId: productOne.id,
            additives: { [additives[0].id]: 2, [additives[1].id]: 1 }
          },
          {
            productId: productTwo.id,
            additives: {}
          }
        ],
        phone: '(000) 465-45-23',
        receivingTime: new Date(
          new Date().setDate(new Date().getDate() + 1)
        ).setHours(19, 0, 1)
      }
    };

    const error = new ValidationError('Invalid order time');

    // @ts-ignore for test purposes
    await ordersPost(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0]).toEqual([error]);
  });
  test('when body is array should throw "Invalid body"', async () => {
    const req = {
      body: []
    };

    const error = new ValidationError('Invalid body');

    // @ts-ignore for test purposes
    await ordersPost(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0]).toEqual([error]);
  });
  test('when body is empty object should throw "Order is empty"', async () => {
    const req = {
      body: {}
    };

    const error = new ValidationError('Order is empty');

    // @ts-ignore for test purposes
    await ordersPost(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0]).toEqual([error]);
  });
  test('when items is not a object should throw "Invalid order"', async () => {
    const req = {
      body: {
        items: 123
      }
    };

    const error = new ValidationError('Invalid order');

    // @ts-ignore for test purposes
    await ordersPost(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0]).toEqual([error]);
  });
  test('when items is null should throw "Invalid order"', async () => {
    const req = {
      body: {
        items: null
      }
    };

    const error = new ValidationError('Invalid order');

    // @ts-ignore for test purposes
    await ordersPost(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0]).toEqual([error]);
  });
  test('when items is a empty array should throw "Invalid order"', async () => {
    const req = {
      body: {
        items: []
      }
    };

    const error = new ValidationError('Invalid order');

    // @ts-ignore for test purposes
    await ordersPost(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0]).toEqual([error]);
  });
  test('when items is a empty array should throw "Invalid order items"', async () => {
    const req = {
      body: {
        items: [1, 2]
      }
    };

    const error = new ValidationError('Invalid order items');

    // @ts-ignore for test purposes
    await ordersPost(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0]).toEqual([error]);
  });
  test('when items additives not object should throw "Invalid order item"', async () => {
    db.products.findOneById
      // @ts-ignore for test purposes
      .mockImplementationOnce(() => productOne)
      .mockImplementationOnce(() => productTwo);
    const req = {
      body: {
        items: [
          {
            productId: productOne.id,
            additives: ''
          },
          {
            productId: productTwo.id,
            additives: ''
          }
        ],
        phone: '(000) 000-00-00',
        receivingTime: new Date().setHours(12, 20, 15)
      }
    };

    const error = new ValidationError('Invalid order item');

    // @ts-ignore for test purposes
    await ordersPost(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0]).toEqual([error]);
  });
  test('when items productID not string should throw "Invalid order item"', async () => {
    db.products.findOneById
      // @ts-ignore for test purposes
      .mockImplementationOnce(() => productOne)
      .mockImplementationOnce(() => productTwo);
    const req = {
      body: {
        items: [
          {
            productId: 11,
            additives: { [additives[0].id]: 2, [additives[1].id]: 1 }
          },
          {
            productId: productTwo.id,
            additives: {}
          }
        ],
        phone: '(000) 000-00-00',
        receivingTime: new Date().setHours(12, 20, 15)
      }
    };

    const error = new ValidationError('Invalid order item');

    // @ts-ignore for test purposes
    await ordersPost(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0]).toEqual([error]);
  });
  test('when additive is object and his value not number should throw "Invalid order item"', async () => {
    db.products.findOneById
      // @ts-ignore for test purposes
      .mockImplementationOnce(() => productOne)
      .mockImplementationOnce(() => productTwo);
    const req = {
      body: {
        items: [
          {
            productId: productOne.id,
            additives: { [additives[0].id]: '2', [additives[1].id]: 1 }
          },
          {
            productId: productTwo.id,
            additives: {}
          }
        ],
        phone: '(000) 000-00-00',
        receivingTime: new Date().setHours(12, 20, 15)
      }
    };

    const error = new ValidationError('Invalid order item');

    // @ts-ignore for test purposes
    await ordersPost(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0]).toEqual([error]);
  });
  test('when phone is not a string should throw "Invalid phone number', async () => {
    db.products.findOneById
      // @ts-ignore for test purposes
      .mockImplementationOnce(() => productOne)
      .mockImplementationOnce(() => productTwo);
    const req = {
      body: {
        items: [
          {
            productId: productOne.id,
            additives: { [additives[0].id]: 2, [additives[1].id]: 1 }
          },
          {
            productId: productTwo.id,
            additives: {}
          }
        ],
        phone: 34545,
        receivingTime: new Date().setHours(12, 10, 15)
      }
    };

    const error = new ValidationError('Invalid phone number');

    // @ts-ignore for test purposes
    await ordersPost(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0]).toEqual([error]);
  });
  test('when phone is not correct should throw "Invalid phone number', async () => {
    db.products.findOneById
      // @ts-ignore for test purposes
      .mockImplementationOnce(() => productOne)
      .mockImplementationOnce(() => productTwo);
    const req = {
      body: {
        items: [
          {
            productId: productOne.id,
            additives: { [additives[0].id]: 2, [additives[1].id]: 1 }
          },
          {
            productId: productTwo.id,
            additives: {}
          }
        ],
        phone: '5345345346',
        receivingTime: new Date().setHours(12, 10, 15)
      }
    };

    const error = new ValidationError('Invalid phone number');

    // @ts-ignore for test purposes
    await ordersPost(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0]).toEqual([error]);
  });
  test('when productId is not exists in db should throw "Products not found"', async () => {
    // @ts-ignore for test purposes
    await db.products.findOneById.mockImplementationOnce(() => undefined);
    const req = {
      body: {
        items: [
          {
            productId: '',
            additives: {}
          }
        ],
        phone: '(000) 000-00-00',
        receivingTime: new Date().setHours(12, 40, 15)
      }
    };

    const error = new ValidationError('Products not found');

    // @ts-ignore for test purposes
    await ordersPost(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0]).toEqual([error]);
  });
  test('when product is not available in db should throw "Products not found"', async () => {
    productTwo = {
      id: '11',
      description: '',
      img: '',
      isAvailable: false,
      price: 15,
      type: 'Солодка випічка',
      name: 'Пеновані з шоколадом та горіхами',
      additives: ['1', '2']
    };
    // @ts-ignore for test purposes
    db.additives.findMany.mockImplementation(() => Promise.resolve(additives));
    db.products.findOneById
      // @ts-ignore for test purposes
      .mockImplementationOnce(() => productOne)
      .mockImplementationOnce(() => productTwo);

    const req = {
      body: {
        items: [
          {
            productId: productOne.id,
            additives: { [additives[0].id]: 2, [additives[1].id]: 1 }
          },
          {
            productId: productTwo.id,
            additives: {}
          }
        ],
        phone: '(000) 000-00-00',
        receivingTime: new Date().setHours(12, 20, 15)
      }
    };

    const error = new ValidationError('Products not found');

    // @ts-ignore for test purposes
    await ordersPost(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0]).toEqual([error]);
  });
  test('when additive is not available in db should throw "Additives not found"', async () => {
    additives = [
      {
        id: '1',
        name: 'sol',
        price: 1,
        img: '',
        isAvailable: false
      },
      {
        id: '2',
        name: 'perec',
        price: 2,
        img: '',
        isAvailable: true
      }
    ];
    db.products.findOneById
      // @ts-ignore for test purposes
      .mockImplementationOnce(() => productOne)
      .mockImplementationOnce(() => productTwo);
    // @ts-ignore for test purposes
    db.additives.findMany.mockImplementation(() => Promise.resolve(additives));
    const req = {
      body: {
        items: [
          {
            productId: productOne.id,
            additives: { [additives[0].id]: 2, [additives[1].id]: 1 }
          },
          {
            productId: productTwo.id,
            additives: {}
          }
        ],
        phone: '(000) 000-00-00',
        receivingTime: new Date().setHours(12, 20, 15)
      }
    };

    const error = new ValidationError('Additives not found');

    // @ts-ignore for test purposes
    await ordersPost(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0]).toEqual([error]);
  });
});
