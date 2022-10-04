import { vacancyCountPut } from '../validation';
import { ValidationError } from '../../../models/errors';

const res = {};
const next = jest.fn();
describe('validation vacancyCountPut', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  test('when id.length < 4 should return "Invalid vacancy id"', () => {
    const req = {
      params: {
        id: '123'
      }
    };
    try {
      // @ts-ignore for test purposes
      vacancyCountPut(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid vacancy id');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when id.length > 4 should go next', () => {
    const req = {
      params: {
        id: '12345'
      }
    };
    try {
      // @ts-ignore for test purposes
      vacancyCountPut(req, res, next);
    } catch (e: any) {
      expect(next).toHaveBeenCalled();
    }
  });
});
