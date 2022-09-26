import { ValidationError } from '../../../models/errors';
import { ordersPost } from '../validation';

const next = jest.fn();
const res = {};
let products = [
  {
    id: '13',
    type: 'Випічка дріжджова',
    img: '',
    price: 18,
    isAvailable: true,
    description: '',
    name: 'Гурулі з цибулею'
  },
  {
    id: '11',
    description: '',
    img: '',
    isAvailable: true,
    price: 15,
    type: 'Солодка випічка',
    name: 'Пеновані з шоколадом та горіхами'
  }
];
jest.mock('../../../models', () => ({
  products: {
    findMany: jest.fn(() => Promise.resolve(products))
  }
}));

describe('ordersPost', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  test('when order correct should go next', async () => {
    const req = {
      body: {
        items: {
          [products[0].id]: 2,
          [products[1].id]: 1
        },
        phone: '(000) 465-45-23'
      }
    };
    // @ts-ignore for test purposes
    await ordersPost(req, res, next);
    expect(next).toHaveBeenCalled();
  });
  test('when body is array should return "Invalid body"', async () => {
    const req = {
      body: []
    };
    try {
      // @ts-ignore for test purposes
      await ordersPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid body');
    }
  });
  test('when body is empty object should return "Order is empty"', async () => {
    const req = {
      body: {}
    };
    try {
      // @ts-ignore for test purposes
      await ordersPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Order is empty');
    }
  });
  test('when items is not a object should return "Invalid order"', async () => {
    const req = {
      body: {
        items: 123
      }
    };
    try {
      // @ts-ignore for test purposes
      await ordersPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid order');
    }
  });
  test('when items is null should return "Invalid order"', async () => {
    const req = {
      body: {
        items: null
      }
    };
    try {
      // @ts-ignore for test purposes
      await ordersPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid order');
    }
  });
  test('when items is a empty array should return "Invalid order"', async () => {
    const req = {
      body: {
        items: []
      }
    };
    try {
      // @ts-ignore for test purposes
      await ordersPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid order');
    }
  });
  test('when items value is not a number should return "Invalid order item"', async () => {
    const req = {
      body: {
        items: {
          [products[0].id]: 'dsds',
          [products[1].id]: 'dsd'
        }
      }
    };
    try {
      // @ts-ignore for test purposes
      await ordersPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid order item');
    }
  });
  test('when items is a empty object should return "Invalid order item"', async () => {
    const req = {
      body: {
        items: {}
      }
    };
    try {
      // @ts-ignore for test purposes
      await ordersPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid order item');
    }
  });
  test('when phone is not a string should return "Invalid phone number', async () => {
    const req = {
      body: {
        items: {
          [products[0].id]: 2,
          [products[1].id]: 1
        },
        phone: 34545
      }
    };
    try {
      // @ts-ignore for test purposes
      await ordersPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid phone number');
    }
  });
  test('when phone is not correct should return "Invalid phone number', async () => {
    const req = {
      body: {
        items: {
          [products[0].id]: 2,
          [products[1].id]: 1
        },
        phone: '5345345346'
      }
    };
    try {
      // @ts-ignore for test purposes
      await ordersPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid phone number');
    }
  });
  test('when productId is not exists in db should return "Products not found"', async () => {
    const req = {
      body: {
        items: {
          [products[0].id]: 2,
          sdsd: 1
        },
        phone: '(000) 000-00-00'
      }
    };
    try {
      // @ts-ignore for test purposes
      await ordersPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Products not found');
    }
  });
  test('when product is not available in db should return "Products not found"', async () => {
    products = [
      {
        id: '13',
        type: 'Випічка дріжджова',
        img: '',
        price: 18,
        isAvailable: false,
        description: '',
        name: 'Гурулі з цибулею'
      },
      {
        id: '11',
        description: '',
        img: '',
        isAvailable: true,
        price: 15,
        type: 'Солодка випічка',
        name: 'Пеновані з шоколадом та горіхами'
      }
    ];
    const req = {
      body: {
        items: {
          [products[0].id]: 2,
          sdsd: 1
        },
        phone: '(000) 000-00-00'
      }
    };
    try {
      // @ts-ignore for test purposes
      await ordersPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Products not found');
    }
  });
});