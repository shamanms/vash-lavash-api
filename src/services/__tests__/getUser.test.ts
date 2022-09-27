import db from '../../models';
import services from '../index';

jest.mock('../../models', () => ({
  users: {
    findMany: jest.fn(() => ['vasya', 123])
  }
}));

describe('Service.getUser', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  test('when req correct should call findMany with username and return username from array', async () => {
    const username = 'vasya';
    const result = await services.users.getUser(username);
    expect(db.users.findMany).toHaveBeenCalledWith([
      'username',
      '==',
      username
    ]);
    expect(result).toEqual('vasya');
  });
});
