import { productGoogleImageUrlGet } from '../validation';
import { ValidationError } from '../../../models/errors';

const res = {};
const next = jest.fn();
describe('validation productGoogleImageUrlGet', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  test('when id.length < 4 should return "Invalid product id"', () => {
    const req = {
      params: {
        id: '123'
      },
      query: {
        fileExtension: 'img'
      }
    };
    try {
      // @ts-ignore for test purposes
      productGoogleImageUrlGet(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid product id');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when fileExtension is not jpeg or jpg should return "Incorrect file extension"', () => {
    const req = {
      params: {
        id: '12345'
      },
      query: {
        fileExtension: 'img'
      }
    };
    try {
      // @ts-ignore for test purposes
      productGoogleImageUrlGet(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Incorrect file extension');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when fileExtension is jpeg should go next', () => {
    const req = {
      params: {
        id: '12345'
      },
      query: {
        fileExtension: 'jpeg'
      }
    };
    try {
      // @ts-ignore for test purposes
      productGoogleImageUrlGet(req, res, next);
    } catch (e: any) {
      expect(next).toHaveBeenCalled();
    }
  });
  test('when fileExtension is jpg should go next', () => {
    const req = {
      params: {
        id: '12345'
      },
      query: {
        fileExtension: 'jpg'
      }
    };
    try {
      // @ts-ignore for test purposes
      productGoogleImageUrlGet(req, res, next);
    } catch (e: any) {
      expect(next).toHaveBeenCalled();
    }
  });
});
