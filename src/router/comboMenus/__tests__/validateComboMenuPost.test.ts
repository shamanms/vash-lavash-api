import { comboMenusPost } from '../validation';
import { ValidationError } from '../../../models/errors';

const res = {};
const next = jest.fn();
describe('comboMenusPost', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  test("when req haven't body should return 'Invalid request'", () => {
    const req = {};
    try {
      // @ts-ignore for test purposes
      comboMenusPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid request');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when body is not obj should return "Invalid request"', () => {
    const req = {
      body: 'test'
    };
    try {
      // @ts-ignore for test purposes
      comboMenusPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid request');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when steps is not array should return "Invalid request"', () => {
    const req = {
      body: {
        steps: {
          step: 1,
          products: {}
        }
      }
    };
    try {
      // @ts-ignore for test purposes
      comboMenusPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid request');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when steps is array but value not object should return "Invalid request"', () => {
    const req = {
      body: {
        steps: [1, 2]
      }
    };
    try {
      // @ts-ignore for test purposes
      comboMenusPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid request');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when products is empty array should return "Incorrect products"', () => {
    const req = {
      body: {
        steps: [
          {
            step: 1,
            products: []
          }
        ]
      }
    };
    try {
      // @ts-ignore for test purposes
      comboMenusPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Incorrect products');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when products value not string is empty array should return "Incorrect products id"', () => {
    const req = {
      body: {
        steps: [
          {
            step: 1,
            products: [1, 2]
          }
        ]
      }
    };
    try {
      // @ts-ignore for test purposes
      comboMenusPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Incorrect products id');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when have not required type value should return "Incorrect shape comboMenu"', () => {
    const req = {
      body: {
        steps: [
          {
            step: 1,
            products: ['bulka', 'soup']
          }
        ]
      }
    };
    try {
      // @ts-ignore for test purposes
      comboMenusPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Incorrect shape comboMenu');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when request is valid should go next', () => {
    const req = {
      body: {
        name: 'string',
        steps: [
          {
            step: 1,
            products: ['bulka', 'soup']
          }
        ],
        isAvailable: false
      }
    };
    // @ts-ignore for test purposes
    comboMenusPost(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
