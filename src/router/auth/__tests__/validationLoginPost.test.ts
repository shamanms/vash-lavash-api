import { ValidationError } from '../../../models/errors';
import { loginPost } from '../validation';

const next = jest.fn();
const res = {};

describe('loginPost', () => {
  test("when req haven't body should return 'Invalid request'", async () => {
    const req = {};
    try {
      // @ts-ignore for test purposes
      await loginPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid request');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test("when req body is not obj should return 'Invalid request'", async () => {
    const req = {
      body: []
    };
    try {
      // @ts-ignore for test purposes
      await loginPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid request');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test("when req body is empty object should return 'Invalid username or password'", async () => {
    const req = {
      body: {}
    };
    try {
      // @ts-ignore for test purposes
      await loginPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid username or password');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test("when body is object and don`t have key username should return 'Invalid username or password'", async () => {
    const req = {
      body: {
        password: 12
      }
    };
    try {
      // @ts-ignore for test purposes
      await loginPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid username or password');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test("when body is object and have key username but don`t have key password should return 'Invalid username or password'", async () => {
    const req = {
      body: {
        username: 'kit'
      }
    };
    try {
      // @ts-ignore for test purposes
      await loginPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid username or password');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test("when body have key username and password but one of values not string should return 'Invalid username or password'", async () => {
    const req = {
      body: {
        username: 'kot',
        password: 12
      }
    };
    try {
      // @ts-ignore for test purposes
      await loginPost(req, res, next);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e?.message).toMatch('Invalid username or password');
      expect(next).not.toHaveBeenCalled();
    }
  });
  test('when request is valid should go next', async () => {
    const req = {
      body: {
        username: 'kot',
        password: 'korm'
      }
    };
    // @ts-ignore for test purposes
    await loginPost(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
