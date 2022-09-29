import { productsPost } from '../validation';
import { ValidationError } from '../../../models/errors';

const res = {};
const next = jest.fn();
describe('productsPost', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  test("when req haven't body should return 'Incorrect products'", () => {
    const req = {};
    try {
      // @ts-ignore for test purposes
      productsPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Incorrect products');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when body is not array should return "Incorrect products"', () => {
    const req = {
      body: 'test'
    };
    try {
      // @ts-ignore for test purposes
      productsPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Incorrect products');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when body is empty array should return "Incorrect products"', () => {
    const req = {
      body: []
    };
    try {
      // @ts-ignore for test purposes
      productsPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Incorrect products');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when body value is not obj should return "Incorrect products"', () => {
    const req = {
      body: ['test']
    };
    try {
      // @ts-ignore for test purposes
      productsPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Incorrect products');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when body is obj in array but have not required key should return "Incorrect shape products"', () => {
    const req = {
      body: [
        {
          isAvailable: 'boolean',
          img: 'string',
          description: 'string'
        }
      ]
    };
    try {
      // @ts-ignore for test purposes
      productsPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Incorrect shape products');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when body is obj in array but have not required type value should return "Incorrect shape products"', () => {
    const req = {
      body: [
        {
          name: 'string',
          price: 'number',
          type: 'string',
          isAvailable: 'boolean',
          img: 'string',
          description: 'string'
        }
      ]
    };
    try {
      // @ts-ignore for test purposes
      productsPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Incorrect shape products');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when request is valid should go next', () => {
    const req = {
      body: [
        {
          name: 'bulka',
          price: 12,
          type: 'pechka',
          isAvailable: false,
          img: 'url',
          description: 'vkysno'
        }
      ]
    };
    // @ts-ignore for test purposes
    productsPost(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
