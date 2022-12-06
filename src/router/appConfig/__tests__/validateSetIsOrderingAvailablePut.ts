import { ValidationError } from '../../../models/errors';
import { setIsOrderingAvailablePut } from '../validation';

const next = jest.fn();
const res = {};

describe('setIsOrderingAvailablePut', () => {
  test("when req haven't body should return 'Invalid request'", async () => {
    const req = {};
    try {
      // @ts-ignore for test purposes
      await setIsOrderingAvailablePut(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid request');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test("when req body is not obj should return 'Invalid request'", async () => {
    const req = {
      body: []
    };
    try {
      // @ts-ignore for test purposes
      await setIsOrderingAvailablePut(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid request');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test("when req body is empty object should return 'Invalid request'", async () => {
    const req = {
      body: {}
    };
    try {
      // @ts-ignore for test purposes
      await setIsOrderingAvailablePut(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid request');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test("when req body is object and have more than one key should return 'Invalid request'", async () => {
    const req = {
      body: { isOpen: false, open: true }
    };
    try {
      // @ts-ignore for test purposes
      await setIsOrderingAvailablePut(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid request');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test("when req body is object and have`t 'isOpen' key should return 'Invalid request'", async () => {
    const req = {
      body: { open: true }
    };
    try {
      // @ts-ignore for test purposes
      await setIsOrderingAvailablePut(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid request');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test("when req body is object but value is`t 'boolean' should return 'Invalid value'", async () => {
    const req = {
      body: { isOpen: 123 }
    };
    try {
      // @ts-ignore for test purposes
      await setIsOrderingAvailablePut(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid value');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when request is valid should go next', () => {
    const req = {
      body: {
        isOpen: true
      }
    };
    // @ts-ignore for test purposes
    setIsOrderingAvailablePut(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
