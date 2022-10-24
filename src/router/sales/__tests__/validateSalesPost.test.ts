import { salesPost } from '../validation';
import { ValidationError } from '../../../models/errors';

const res = {};
const next = jest.fn();
describe('salesPost', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  test("when req haven't body should return 'Invalid request'", () => {
    const req = {};
    try {
      // @ts-ignore for test purposes
      salesPost(req, res, next);
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
      salesPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid request');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when body is empty obj should return "Incorrect sale"', () => {
    const req = {
      body: {}
    };
    try {
      // @ts-ignore for test purposes
      salesPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Incorrect sale');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when body is obj but have not required key should return "Incorrect shape sale"', () => {
    const req = {
      body: {
        name: 'string',
        img: 'string',
        description: 'string'
      }
    };
    try {
      // @ts-ignore for test purposes
      salesPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Incorrect shape sale');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when body is obj in array but have not required type value should return "Incorrect shape sale"', () => {
    const req = {
      body: {
        name: 'string',
        price: 'number',
        type: 'string',
        isAvailable: 'boolean',
        img: 'string',
        description: 'string'
      }
    };
    try {
      // @ts-ignore for test purposes
      salesPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Incorrect shape sale');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when request is valid should go next', () => {
    const req = {
      body: {
        name: 'string',
        img: 'string',
        description: 'string',
        isAvailable: false
      }
    };
    // @ts-ignore for test purposes
    salesPost(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
