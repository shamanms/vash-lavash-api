import { categoryPost } from '../validation';
import { ValidationError } from '../../../models/errors';

const res = {};
const next = jest.fn();
describe('categoryPost', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  test("when req haven't body should return 'Invalid request'", () => {
    const req = {};
    try {
      // @ts-ignore for test purposes
      categoryPost(req, res, next);
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
      categoryPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid request');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when additionalItems is not array should return "Invalid request"', () => {
    const req = {
      body: {
        additionalItems: {
          type: 'someType',
          itemId: 1
        }
      }
    };
    try {
      // @ts-ignore for test purposes
      categoryPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid request');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when have not required type value should return "Incorrect shape category"', () => {
    const req = {
      body: {
        additionalItems: [
          {
            type: 1
          }
        ],
        name: 1,
        order: 'someString'
      }
    };
    try {
      // @ts-ignore for test purposes
      categoryPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Incorrect shape category');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when itemId value not string should return "Incorrect item id"', () => {
    const req = {
      body: {
        additionalItems: [
          {
            type: 1,
            itemId: 2
          }
        ],
        name: 'someName',
        order: 1
      }
    };
    try {
      // @ts-ignore for test purposes
      categoryPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Incorrect item id');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when type value not additionalItemTypes should return "Incorrect type item"', () => {
    const req = {
      body: {
        additionalItems: [
          {
            type: 1,
            itemId: 'someId'
          }
        ],
        name: 'someName',
        order: 1
      }
    };
    try {
      // @ts-ignore for test purposes
      categoryPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Incorrect type item');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when request is valid should go next', () => {
    const req = {
      body: {
        additionalItems: [
          {
            type: 'comboMenu',
            itemId: 'someId'
          }
        ],
        name: 'someName',
        order: 1
      }
    };
    // @ts-ignore for test purposes
    categoryPost(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
