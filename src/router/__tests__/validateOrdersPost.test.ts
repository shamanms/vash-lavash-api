import { validateOrdersPost } from '../validation';
import { ValidationError } from '../../models/errors';

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
jest.mock('../../models', () => ({
  products: {
    findMany: jest.fn(() => Promise.resolve(products))
  }
}));

describe('validateOrdersPost', () => {
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
    await validateOrdersPost(req, res, next);
    expect(next).toHaveBeenCalled();
  });
  test('when body array should return "Invalid body"', async () => {
    const req = {
      body: []
    };
    try {
      // @ts-ignore for test purposes
      await validateOrdersPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid body');
    }
  });
  test('when body empty object should return "Order is empty"', async () => {
    const req = {
      body: {}
    };
    try {
      // @ts-ignore for test purposes
      await validateOrdersPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Order is empty');
    }
  });
  test('when items not object should return "Invalid order"', async () => {
    const req = {
      body: {
        items: 123
      }
    };
    try {
      // @ts-ignore for test purposes
      await validateOrdersPost(req, res, next);
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
      await validateOrdersPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid order');
    }
  });
  test('when items is [] should return "Invalid order"', async () => {
    const req = {
      body: {
        items: []
      }
    };
    try {
      // @ts-ignore for test purposes
      await validateOrdersPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid order');
    }
  });
  test('when items value not number should return "Invalid order item"', async () => {
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
      await validateOrdersPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid order item');
    }
  });
  test('when items is empty object should return "Invalid order item"', async () => {
    const req = {
      body: {
        items: {}
      }
    };
    try {
      // @ts-ignore for test purposes
      await validateOrdersPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid order item');
    }
  });
  test('when phone not string should return "Invalid phone number', async () => {
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
      await validateOrdersPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid phone number');
    }
  });
  test('when phone not correct should return "Invalid phone number', async () => {
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
      await validateOrdersPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid phone number');
    }
  });
  test('when productId is not exists in data should return "Products not found"', async () => {
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
      await validateOrdersPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Products not found');
    }
  });
  test('when product is not available in data should return "Products not found"', async () => {
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
      await validateOrdersPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Products not found');
    }
  });
});
