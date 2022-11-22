import { labelPost } from '../validation';
import { ValidationError } from '../../../models/errors';

const res = {};
const next = jest.fn();
describe('labelPost', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  test("when req haven't body should return 'Invalid request'", () => {
    const req = {};
    try {
      // @ts-ignore for test purposes
      labelPost(req, res, next);
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
      labelPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid request');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when body is empty obj should return "Incorrect label"', () => {
    const req = {
      body: {}
    };
    try {
      // @ts-ignore for test purposes
      labelPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Incorrect label');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when body is obj but have not required key should return "Incorrect shape label"', () => {
    const req = {
      body: {
        name: 'string',
        img: 'string'
      }
    };
    try {
      // @ts-ignore for test purposes
      labelPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Incorrect shape label');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when body is obj but have not required type value should return "Incorrect shape label"', () => {
    const req = {
      body: {
        name: 'string',
        color: false
      }
    };
    try {
      // @ts-ignore for test purposes
      labelPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Incorrect shape label');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when request is valid should go next', () => {
    const req = {
      body: {
        name: 'string',
        color: 'string'
      }
    };
    // @ts-ignore for test purposes
    labelPost(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
