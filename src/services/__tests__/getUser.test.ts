import db from '../../models';
import services from '../index';
import { UserModel } from '../../types';

jest.mock('../../models', () => ({
  users: {
    findMany: jest.fn(() => ['vasya', 123]),
    findOneById: jest.fn(() => ({
      id: 'testUserId',
      username: 'vasya',
      password: '123',
      firstName: 'vasylii',
      lastName: 'ivanov',
      role: 'testRole',
      isActive: true,
      loginDates: [1, 2, 3]
    }))
  }
}));

describe('Service.getUser', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  test('when req correct should call findMany with username and return username from array', async () => {
    const username = 'vasya';
    const result = await services.users.getUserByName(username);
    expect(db.users.findMany).toHaveBeenCalledWith([
      'username',
      '==',
      username
    ]);
    expect(result).toEqual('vasya');
  });
  test('when req correct should call findOneById with user id and return user', async () => {
    const userId = 'testUserId';
    const user = {
      id: 'testUserId',
      username: 'vasya',
      password: '123',
      firstName: 'vasylii',
      lastName: 'ivanov',
      role: 'testRole',
      isActive: true,
      loginDates: [1, 2, 3]
    };

    const result = await services.users.getUserById(userId);
    expect(db.users.findOneById).toHaveBeenCalledWith(userId);
    expect(result).toEqual(user);
  });
  test('when req correct should call findOneById with user id and projection and return user', async () => {
    const userId = 'testUserId';
    const user = {
      firstName: 'vasylii',
      lastName: 'ivanov',
      role: 'testRole'
    };
    const projection = ['firstName', 'lastName', 'role'] as (keyof UserModel)[];
    const result = await services.users.getUserById(userId, projection);
    expect(db.users.findOneById).toHaveBeenCalledWith(userId);
    expect(result).toEqual(user);
  });
});
