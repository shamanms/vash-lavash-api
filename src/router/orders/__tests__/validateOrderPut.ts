import { orderPut } from '../validation';
import { ValidationError } from '../../../models/errors';

const next = jest.fn();
const res = {};

describe('orderPut', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  test('when query is empty obj should return "Invalid status"', async () => {
    const req = {
      params: {
        id: '123'
      },
      query: {}
    };
    try {
      // @ts-ignore for unit test
      await orderPut(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid status');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when query value is not equals enum OrderStatus  should return "Invalid status"', async () => {
    const req = {
      params: {
        id: '123'
      },
      query: {
        status: 'any'
      }
    };
    try {
      // @ts-ignore for unit test
      await orderPut(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid status');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when query not have key "status" should return "Invalid status"', async () => {
    const req = {
      params: {
        id: '123'
      },
      query: {
        aaa: 'any'
      }
    };
    try {
      // @ts-ignore for unit test
      await orderPut(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid status');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when req correct should go next', async () => {
    const req = {
      params: {
        id: '123'
      },
      query: {
        status: 'completed'
      }
    };
    try {
      // @ts-ignore for unit test
      await orderPut(req, res, next);
    } catch (e: any) {
      expect(next).toHaveBeenCalled();
    }
  });
});
