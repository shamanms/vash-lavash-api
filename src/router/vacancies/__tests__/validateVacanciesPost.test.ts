import { vacanciesPost } from '../validation';
import { ValidationError } from '../../../models/errors';

const res = {};
const next = jest.fn();
describe('vacanciesPost', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  test("when req haven't body should return 'Invalid request'", () => {
    const req = {};
    try {
      // @ts-ignore for test purposes
      vacanciesPost(req, res, next);
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
      vacanciesPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid request');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when body is empty obj should return "Incorrect vacancy"', () => {
    const req = {
      body: {}
    };
    try {
      // @ts-ignore for test purposes
      vacanciesPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Incorrect vacancy');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when body is obj but have not required key should return "Incorrect shape vacancy"', () => {
    const req = {
      body: {
        position: 'string',
        requirements: 'string',
        salary: 'string'
      }
    };
    try {
      // @ts-ignore for test purposes
      vacanciesPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Incorrect shape vacancy');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when body is obj in array but have not required type value should return "Incorrect shape vacancy"', () => {
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
      vacanciesPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Incorrect shape vacancy');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when request is valid should go next', () => {
    const req = {
      body: {
        position: 'string',
        requirements: 'string',
        salary: 'string',
        description: 'string',
        isAvailable: false
      }
    };
    // @ts-ignore for test purposes
    vacanciesPost(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
