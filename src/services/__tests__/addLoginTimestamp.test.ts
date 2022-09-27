import services from '../index';
import db from '../../models';

const dateNow = Date.now();
jest.mock('../../models', () => ({
  users: {
    updateOne: jest.fn()
  }
}));

describe('Service.addLoginTimestamp', () => {
  beforeEach(() => {
    jest.resetModules();
    global.Date.now = jest.fn(() => dateNow);
  });
  test('when user id is correct should add date.now in loginDates', async () => {
    const user = {
      id: 'fefw43',
      username: 'pete',
      password: '123',
      role: 'user',
      loginDates: [1]
    };
    await services.users.addLoginTimestamp(user);

    expect(db.users.updateOne).toHaveBeenCalledWith(user.id, {
      loginDates: [1, dateNow]
    });
  });
  test('when user id is invalid should return "UsersService.addLoginTimestamp:: invalid user id"', async () => {
    const user = {
      id: undefined,
      username: 'pete',
      password: '123',
      role: 'user',
      loginDates: [1]
    };
    try {
      await services.users.addLoginTimestamp(user);
    } catch (e: any) {
      expect(e?.message).toMatch(
        'UsersService.addLoginTimestamp:: invalid user id'
      );
    }
  });
});