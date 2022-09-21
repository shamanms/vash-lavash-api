import { validateProductsPut } from '../validation';
import { ValidationError } from '../../models/errors';

const res = {};
const next = jest.fn();
describe('validateProductsPut', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  test("when req haven't body should return 'Invalid request'", () => {
    const req = {};
    try {
      // @ts-ignore for test purposes
      validateProductsPut(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid request');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when products array is empty should return "Products not passed"', () => {
    const req = {
      body: []
    };
    try {
      // @ts-ignore for test purposes
      validateProductsPut(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Products not passed');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when any product !== object should return invalid product', () => {
    const req = {
      body: [{ id: 'testId' }, 12345]
    };
    try {
      // @ts-ignore for test purposes
      validateProductsPut(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid product');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when product === null should return "Invalid product"', () => {
    const req = {
      body: [null]
    };
    try {
      // @ts-ignore for test purposes
      validateProductsPut(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid product');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when product is array should return "Invalid product"', () => {
    const req = {
      body: [[], []]
    };
    try {
      // @ts-ignore for test purposes
      validateProductsPut(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid product');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when product.id !== string should return invalid product', () => {
    const req = {
      body: [
        {
          id: 123
        }
      ]
    };
    try {
      // @ts-ignore for test purposes
      validateProductsPut(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid product');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when request is valid should go next', () => {
    const req = {
      body: [
        {
          id: '123'
        }
      ]
    };
    // @ts-ignore for test purposes
    validateProductsPut(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
