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
  test('when query is array but not boolean  should return invalid parameter', () => {
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
});
