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
  test('when req havent body should return invalid request', () => {
    const req = {};
    // @ts-ignore for test purposes
    validateProductsPut(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(sendMessage).toHaveBeenCalledWith('Invalid request');
  });
  test('when product !== object should return invalid product', () => {
    const req = {
      body: [{}]
    };
    // @ts-ignore for test purposes
    validateProductsPut(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(sendMessage).toHaveBeenCalledWith('Invalid product');
  });
  test('when product === null should return invalid product', () => {
    const req = {
      body: [null]
    };
    // @ts-ignore for test purposes
    validateProductsPut(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(sendMessage).toHaveBeenCalledWith('Invalid product');
  });
  test('when product !== [] should return invalid product', () => {
    const req = {
      body: [[]]
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
});
