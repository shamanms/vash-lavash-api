import { validateOrdersPost } from '../validation';
import { ValidationError } from '../../models/errors';

const next = jest.fn();
const res = {};

describe('validateOrdersPost', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  test('when order correct should go next', () => {
    const req = {
      body: {
        items: {
          idProduct: 2
        },
        phone: '(000) 465-45-23'
      }
    };
    // @ts-ignore for test purposes
    validateOrdersPost(req, res, next);
    expect(next).toHaveBeenCalled();
  });
  test('when body array should return "Invalid body"', () => {
    const req = {
      body: []
    };
    try {
      // @ts-ignore for test purposes
      validateOrdersPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid body');
    }
  });
  test('when body empty object should return "Order is empty"', () => {
    const req = {
      body: {}
    };
    try {
      // @ts-ignore for test purposes
      validateOrdersPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Order is empty');
    }
  });
  test('when items not object should return "Invalid order"', () => {
    const req = {
      body: {
        items: 123
      }
    };
    try {
      // @ts-ignore for test purposes
      validateOrdersPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid order');
    }
  });
  test('when items is null should return "Invalid order"', () => {
    const req = {
      body: {
        items: null
      }
    };
    try {
      // @ts-ignore for test purposes
      validateOrdersPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid order');
    }
  });
  test('when items is [] should return "Invalid order"', () => {
    const req = {
      body: {
        items: []
      }
    };
    try {
      // @ts-ignore for test purposes
      validateOrdersPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid order');
    }
  });
  test('when items value not number should return "Invalid order item"', () => {
    const req = {
      body: {
        items: {
          productId: 'string'
        }
      }
    };
    try {
      // @ts-ignore for test purposes
      validateOrdersPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid order item');
    }
  });
  test('when items is empty object should return "Invalid order item"', () => {
    const req = {
      body: {
        items: {}
      }
    };
    try {
      // @ts-ignore for test purposes
      validateOrdersPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid order item');
    }
  });
  test('when phone not string should return "Invalid phone number', () => {
    const req = {
      body: {
        items: {
          idProduct: 2
        },
        phone: 34545
      }
    };
    try {
      // @ts-ignore for test purposes
      validateOrdersPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid phone number');
    }
  });
  test('when phone not correct should return "Invalid phone number', () => {
    const req = {
      body: {
        items: {
          idProduct: 2
        },
        phone: '5345345346'
      }
    };
    try {
      // @ts-ignore for test purposes
      validateOrdersPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid phone number');
    }
  });
});
