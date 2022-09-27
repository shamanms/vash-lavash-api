import services from '../../../services';
import { response } from 'express';
import jwt from 'jsonwebtoken';
import { login } from '../route';

const jsonFn = jest.fn();
const next = jest.fn();
jest.mock('../../../services', () => ({
  users: {
    getUser: jest.fn(),
    addLoginTimestamp: jest.fn()
  }
}));
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'token')
}));
jest.mock('express', () => ({
  response: { status: jest.fn(() => ({ json: jsonFn })), json: jest.fn() }
}));
const secret = '12345';
jest.mock('../../../services/jwt', () => ({
  accessSecretVersion: jest.fn(() => Promise.resolve(secret))
}));

describe('route login', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  jest.spyOn(console, 'log').mockImplementation();
  test('when username and password correct should return token', async () => {
    const req = {
      body: {
        username: 'chelovek',
        password: 'mashina'
      }
    };
    const user = {
      ...req.body,
      id: 'id',
      role: 'admin'
    };
    // @ts-ignore for test purposes
    services.users.getUser.mockImplementation(() => user);
    const parForRes = {
      token: 'token'
    };
    const parForJwt = [
      {
        id: user.id,
        role: user.role
      },
      { expiresIn: 900000 }
    ];
    await login(req, response, next);

    expect(console.log).toHaveBeenCalledWith(
      `${req.body.username} is trying to login ..`
    );
    expect(services.users.getUser).toHaveBeenCalledWith(req.body.username);
    expect(services.users.addLoginTimestamp).toHaveBeenCalledWith(user);
    expect(response.json).toHaveBeenCalledWith(parForRes);
    expect(jwt.sign).toHaveBeenCalledWith(parForJwt[0], secret, parForJwt[1]);
  });
  test('when user invalid should return status 401 and message: "The username and password your provided are invalid"', async () => {
    const req = {
      body: {
        username: 'chelovek',
        password: 'mashina'
      }
    };
    const message = {
      message: 'The username and password your provided are invalid'
    };
    // @ts-ignore for test purposes
    services.users.getUser.mockImplementation(() => false);
    await login(req, response, next);
    expect(response.status).toHaveBeenCalledWith(401);
    expect(jsonFn).toHaveBeenCalledWith(message);
  });
  test('when db not working should go next', async () => {
    const req = {};
    // @ts-ignore for test purposes
    await login(req, response, next);
    expect(next).toHaveBeenCalled();
  });
});
