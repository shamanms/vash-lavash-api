import { comboMenusGet } from '../validation';
import { ValidationError } from '../../../models/errors';

const res = {};
const next = jest.fn();

describe('comboMenusGet', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  test('when query is array but not boolean should return "Invalid parameter"', () => {
    const isAvailable = [123, 321];
    const req = {
      query: {
        isAvailable
      }
    };
    try {
      // @ts-ignore for test purposes
      comboMenusGet(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid parameter');
      expect(next).not.toHaveBeenCalled();
    }
  });

  test('when query is "true" should return should go next', () => {
    const req = {
      query: {
        isAvailable: 'true'
      }
    };
    // @ts-ignore for test purposes
    comboMenusGet(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('when query is "false" should return should go next', () => {
    const req = {
      query: {
        isAvailable: 'false'
      }
    };
    // @ts-ignore for test purposes
    comboMenusGet(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('when isAvailable parameter not passed should go next', () => {
    const req = { query: {} };
    // @ts-ignore for test purposes
    comboMenusGet(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
