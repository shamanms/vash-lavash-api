import { response } from 'express';
import { adminAuth } from '../middlewares';
import jwt from 'jsonwebtoken';
import { accessSecretVersion } from '../../../services/jwt';

const sendFn = jest.fn();
const next = jest.fn();
jest.mock('express', () => ({
  response: { status: jest.fn(() => ({ send: sendFn })) }
}));
const secret = '12345';
jest.mock('../../../services/jwt', () => ({
  accessSecretVersion: jest.fn(() => Promise.resolve(secret))
}));
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn()
}));

describe('middlewares adminAuth ', () => {
  beforeEach(() => {
    jest.resetModules();
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
    expect(sendFn).toHaveBeenCalledWith(
      'A token is required for authentication'
    );
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
    expect(sendFn).toHaveBeenCalledWith('Not Allowed');
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
    expect(sendFn).toHaveBeenCalledWith('Not Allowed');
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
      role: 'admin'
    }));
    // @ts-ignore for test purposes
    await adminAuth(req, response, next);

    expect(jwt.verify).toHaveBeenCalledWith(token, secret);
    expect(next).toHaveBeenCalled();
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
    expect(sendFn).toHaveBeenCalledWith('Invalid Token');
  });
});
