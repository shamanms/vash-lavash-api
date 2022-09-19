import { validateProductsGet } from '../validation';

const sendMessage = jest.fn();
const res = {
  status: jest.fn().mockImplementation(() => ({
    send: sendMessage
  }))
};

describe('validateProductsGet', () => {
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
    // @ts-ignore for test purposes
    validateProductsGet(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(sendMessage).toHaveBeenCalledWith('Invalid parameter');
  });

  test('when query is "true" should return "Invalid parameter"', () => {
    const req = {
      query: {
        isAvailable: 'true'
      }
    };
    // @ts-ignore for test purposes
    validateProductsGet(req, res);
    expect(res.status).not.toHaveBeenCalled();
    expect(sendMessage).not.toHaveBeenCalled();
  });

  test('when query is "false" should return "Invalid parameter"', () => {
    const req = {
      query: {
        isAvailable: 'false'
      }
    };
    // @ts-ignore for test purposes
    validateProductsGet(req, res);
    expect(res.status).not.toHaveBeenCalled();
    expect(sendMessage).not.toHaveBeenCalled();
  });

  test('when isAvailable parameter not passed should return nothing', () => {
    const req = { query: {} };
    // @ts-ignore for test purposes
    validateProductsGet(req, res);
    expect(res.status).not.toHaveBeenCalled();
    expect(sendMessage).not.toHaveBeenCalled();
  });
});
