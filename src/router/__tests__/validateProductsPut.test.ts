import { validateProductsPut } from '../validation';

const sendMessage = jest.fn();
const res = {
  status: jest.fn().mockImplementation(() => ({
    send: sendMessage
  }))
};
describe('validateProductsPut', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  test("when req haven't body should return 'Invalid request'", () => {
    const req = {};
    // @ts-ignore for test purposes
    validateProductsPut(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(sendMessage).toHaveBeenCalledWith('Invalid request');
  });
  test('when products array is empty should return "Products not passed"', () => {
    const req = {
      body: []
    };
    // @ts-ignore for test purposes
    validateProductsPut(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(sendMessage).toHaveBeenCalledWith('Products not passed');
  });
  test('when any product !== object should return invalid product', () => {
    const req = {
      body: [{ id: 'testId' }, 12345]
    };
    // @ts-ignore for test purposes
    validateProductsPut(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(sendMessage).toHaveBeenCalledWith('Invalid product');
  });
  test('when product === null should return "Invalid product"', () => {
    const req = {
      body: [null]
    };
    // @ts-ignore for test purposes
    validateProductsPut(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(sendMessage).toHaveBeenCalledWith('Invalid product');
  });
  test('when product is array should return "Invalid product"', () => {
    const req = {
      body: [[], []]
    };
    // @ts-ignore for test purposes
    validateProductsPut(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(sendMessage).toHaveBeenCalledWith('Invalid product');
  });
  test('when product.id !== string should return invalid product', () => {
    const req = {
      body: [
        {
          id: 123
        }
      ]
    };
    // @ts-ignore for test purposes
    validateProductsPut(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(sendMessage).toHaveBeenCalledWith('Invalid product');
  });
  test('when request is valid should return nothing', () => {
    const req = {
      body: [
        {
          id: '123'
        }
      ]
    };
    // @ts-ignore for test purposes
    validateProductsPut(req, res);
    expect(res.status).not.toHaveBeenCalled();
    expect(sendMessage).not.toHaveBeenCalled();
  });
});
