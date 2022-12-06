import { response } from 'express';
import { adminAuth } from '../middlewares';
import jwt from 'jsonwebtoken';

const sendFn = jest.fn();
const next = jest.fn();
jest.mock('express', () => ({
  response: { status: jest.fn(() => ({ send: sendFn })) }
}));
const JWT_SECRET = '12345';
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn()
}));

describe('middlewares adminAuth ', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...process.env,
      JWT_SECRET
    };
  });
  afterAll(() => {
    delete process.env.JWT_SECRET;
  });
  test('when req is empty should return status 403 and message "A token is required for authentication"', async () => {
    const req = undefined;
    // @ts-ignore for test purposes
    await adminAuth(req, response, next);

    expect(response.status).toHaveBeenCalledWith(403);
    expect(sendFn).toHaveBeenCalledWith({
      message: 'A token is required for authentication'
    });
  });
  test('when token have`t "Bearer" should return status 403 and message "A token is required for authentication"', async () => {
    const req = {
      headers: {
        authorization: '123'
      }
    };
    // @ts-ignore for test purposes
    await adminAuth(req, response, next);

    expect(response.status).toHaveBeenCalledWith(403);
    expect(sendFn).toHaveBeenCalledWith({
      message: 'A token is required for authentication'
    });
  });
  test('when token is not found in db should return status 403 and message "Not Allowed"', async () => {
    const req = {
      headers: {
        authorization: 'Bearer 123'
      }
    };
    // @ts-ignore for test purposes
    await adminAuth(req, response, next);

    expect(jwt.verify).toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(403);
    expect(sendFn).toHaveBeenCalledWith({ message: 'Not Allowed' });
  });
  test('when token is correct but user role not admin should return status 403 and message "Not Allowed"', async () => {
    const req = {
      headers: {
        authorization: 'Bearer 123'
      }
    };
    // @ts-ignore for test purposes
    jwt.verify.mockImplementation(() => ({
      role: 'cashier'
    }));
    // @ts-ignore for test purposes
    await adminAuth(req, response, next);

    expect(jwt.verify).toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(403);
    expect(sendFn).toHaveBeenCalledWith({ message: 'Not Allowed' });
  });
  test('when token is correct and user role is admin should go next', async () => {
    const req = {
      headers: {
        authorization: 'Bearer 123'
      }
    };
    const token = req.headers.authorization.replace('Bearer ', '');
    // @ts-ignore for test purposes
    jwt.verify.mockImplementation(() => ({
      id: '1',
      role: 'admin'
    }));
    // @ts-ignore for test purposes
    await adminAuth(req, response, next);
    const newReq = { ...req, user: { id: '1', role: 'admin' } };

    expect(jwt.verify).toHaveBeenCalledWith(token, JWT_SECRET);
    expect(next).toHaveBeenCalled();
    expect(req).toEqual(newReq);
  });
  test('when token is correct but userid is undefined and role is admin should go next', async () => {
    const req = {
      headers: {
        authorization: 'Bearer 123'
      }
    };
    const token = req.headers.authorization.replace('Bearer ', '');
    // @ts-ignore for test purposes
    jwt.verify.mockImplementation(() => ({
      id: undefined,
      role: 'admin'
    }));
    // @ts-ignore for test purposes
    await adminAuth(req, response, next);
    const newReq = { ...req, user: { id: undefined, role: 'admin' } };

    expect(jwt.verify).toHaveBeenCalledWith(token, JWT_SECRET);
    expect(next).toHaveBeenCalled();
    expect(req).toEqual(newReq);
  });
  test('when token is invalid should return status 403 and message "Invalid Token"', async () => {
    const req = {
      headers: {
        authorization: 'Bearer 123'
      }
    };
    // @ts-ignore for test purposes
    jwt.verify.mockImplementation(() => {
      throw new Error('');
    });

    // @ts-ignore for test purposes
    await adminAuth(req, response, next);

    expect(response.status).toHaveBeenCalledWith(401);
    expect(sendFn).toHaveBeenCalledWith({ message: 'Invalid Token' });
  });
});
