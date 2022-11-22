import { labelsPut } from '../validation';
import { ValidationError } from '../../../models/errors';

const res = {};
const next = jest.fn();
describe('labelsPut', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  test("when req haven't body should return 'Invalid request'", () => {
    const req = {};
    try {
      // @ts-ignore for test purposes
      labelsPut(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid request');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when req is array should return "Invalid request"', () => {
    const req: unknown[] = [];
    try {
      // @ts-ignore for test purposes
      labelsPut(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid request');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when req is null should return "Invalid request"', () => {
    const req = {
      body: null
    };
    try {
      // @ts-ignore for test purposes
      labelsPut(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid request');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when req.id is empty obj should return "Label not passed"', () => {
    const req = {
      body: {}
    };
    try {
      // @ts-ignore for test purposes
      labelsPut(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Label not passed');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when req.id not object should return "Incorrect labels"', () => {
    const req = {
      body: {
        id: 123
      }
    };
    try {
      // @ts-ignore for test purposes
      labelsPut(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Incorrect labels');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when req.id is null should return "Incorrect labels"', () => {
    const req = {
      body: {
        id: null
      }
    };
    try {
      // @ts-ignore for test purposes
      labelsPut(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Incorrect labels');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when req.id is array should return "Incorrect labels"', () => {
    const req = {
      body: {
        id: [123, 123]
      }
    };
    try {
      // @ts-ignore for test purposes
      labelsPut(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Incorrect labels');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when request is valid should go next', () => {
    const req = {
      body: {
        id: {
          color: 'green',
          name: 'top'
        }
      }
    };
    // @ts-ignore for test purposes
    labelsPut(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
