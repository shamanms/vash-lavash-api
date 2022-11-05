import { additivesPost } from '../validation';
import { ValidationError } from '../../../models/errors';

const res = {};
const next = jest.fn();
describe('additivesPost', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  test("when req haven't body should return 'Invalid request'", () => {
    const req = {};
    try {
      // @ts-ignore for test purposes
      additivesPost(req, res, next);
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
      additivesPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid request');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when body is empty obj should return "Incorrect additive"', () => {
    const req = {
      body: {}
    };
    try {
      // @ts-ignore for test purposes
      additivesPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Incorrect additive');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when body is obj but have not required key should return "Incorrect shape additive"', () => {
    const req = {
      body: {
        name: 'string',
        price: 11,
        img: 'string'
      }
    };
    try {
      // @ts-ignore for test purposes
      additivesPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Incorrect shape additive');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when body is obj but have not required type value should return "Incorrect shape additive"', () => {
    const req = {
      body: {
        name: 'string',
        price: 'number',
        isAvailable: 'boolean',
        img: 'string'
      }
    };
    try {
      // @ts-ignore for test purposes
      additivesPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Incorrect shape additive');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when request is valid should go next', () => {
    const req = {
      body: {
        name: 'string',
        price: 1,
        img: 'string',
        isAvailable: false
      }
    };
    // @ts-ignore for test purposes
    additivesPost(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
