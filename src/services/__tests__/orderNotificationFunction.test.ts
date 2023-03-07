import { Telegram } from 'telegraf';
import db from '../../models';
import { orderNotification } from '../orderNotification';
import { OrderNotification } from '../orderNotificationClass';
import services from '../index';
import { UserRole } from '../../types';
import jwt from 'jsonwebtoken';

jest.mock('telegraf');
jest.mock('../orderNotificationClass');
const sendMethod = jest.fn();
// @ts-ignore for test purposes
OrderNotification.mockImplementation(() => {
  return {
    send: sendMethod
  };
});

jest.mock('../index', () => ({
  users: {
    getUserByName: jest.fn()
  }
}));

const snapshotData = jest.fn();
jest.mock('../../models', () => ({
  orders: {
    collection: {
      doc: jest.fn().mockImplementation(() => ({
        get: jest.fn().mockImplementation(() =>
          Promise.resolve({
            data: snapshotData
          })
        )
      }))
    }
  }
}));
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn()
}));
jest.spyOn(console, 'log').mockImplementation();

describe('function orderNotification', () => {
  const event = {
    value: {
      name: 'V/asya',
      fields: {},
      createTime: '1232321313',
      updateTime: '32432423423'
    }
  };
  let context = {
    eventType: 'kk/kk',
    resource: 'zakaz'
  };
  const modifiedDocument = {
    id: 'asya',
    name: 'aza'
  };
  const userDb = { id: 'testId', role: UserRole.SYSTEM };

  beforeEach(() => {
    jest.resetModules();
  });

  test('should send message', async () => {
    snapshotData.mockImplementation(() => modifiedDocument);
    // @ts-ignore for test purposes
    services.users.getUserByName.mockImplementation(() => userDb);
    process.env = {
      ...process.env,
      TELEGRAM_TOKEN: 'chat',
      GROUP_ID: 'lavash',
      JWT_SECRET: 'testJWT'
    };
    await orderNotification(event, context);
    expect(db.orders.collection.doc).toHaveBeenCalledWith('asya');
    expect(snapshotData).toHaveBeenCalled();
    expect(services.users.getUserByName).toHaveBeenCalledWith('telegram');
    expect(Telegram).toHaveBeenCalledWith(process.env.TELEGRAM_TOKEN as string);

    // @ts-ignore for test purposes
    const lastServiceCall = OrderNotification.mock;
    expect(lastServiceCall.calls[0][0]).toEqual(modifiedDocument);
    expect(lastServiceCall.calls[0][1]).toBeInstanceOf(Telegram);
    expect(lastServiceCall.calls[0][2]).toEqual(process.env.GROUP_ID);
    expect(jwt.sign).toHaveBeenCalledWith(
      userDb,
      process.env.JWT_SECRET as string,
      { expiresIn: 86400 }
    );

    expect(sendMethod).toHaveBeenCalled();
  });

  test('should return error if user is not telegram', async () => {
    snapshotData.mockImplementation(() => modifiedDocument);
    // @ts-ignore for test purposes
    services.users.getUserByName.mockImplementation(() => undefined);
    jest.spyOn(console, 'error').mockImplementation();

    try {
      await orderNotification(event, context);
    } catch (e: any) {
      expect(e?.message).toMatch('Unable to get telegram user data');
      expect(console.error).toHaveBeenCalledWith(
        `Parameter "documentId" is invalid`
      );
    }
  });

  test('should return error if data empty', async () => {
    snapshotData.mockImplementation(() => undefined);
    // @ts-ignore for test purposes
    services.users.getUserByName.mockImplementation(() => userDb);
    jest.spyOn(console, 'error').mockImplementation();

    try {
      await orderNotification(event, context);
    } catch (e: any) {
      expect(e?.message).toMatch('Unable to get data for asya');
      expect(console.error).toHaveBeenCalledWith(
        `Parameter "documentId" is invalid`
      );
    }
  });

  test('should console error if TELEGRAM_TOKEN empty', async () => {
    snapshotData.mockImplementation(() => modifiedDocument);
    jest.spyOn(console, 'error').mockImplementation();
    process.env = {
      ...process.env,
      TELEGRAM_TOKEN: undefined,
      GROUP_ID: 'lavash'
    };

    await orderNotification(event, context);

    expect(console.error).toHaveBeenCalledWith(
      `Parameter "TELEGRAM_TOKEN" is invalid`
    );
  });

  test('should console error if GROUP_ID empty', async () => {
    snapshotData.mockImplementation(() => modifiedDocument);
    jest.spyOn(console, 'error').mockImplementation();
    process.env = {
      ...process.env,
      TELEGRAM_TOKEN: 'chat',
      GROUP_ID: undefined
    };

    await orderNotification(event, context);

    expect(console.error).toHaveBeenCalledWith(
      `Parameter "GROUP_ID" is invalid`
    );
  });

  test('should console error if documentId, TELEGRAM_TOKEN, GROUP_ID empty', async () => {
    jest.spyOn(console, 'error').mockImplementation();
    process.env = {
      ...process.env,
      TELEGRAM_TOKEN: undefined,
      GROUP_ID: undefined
    };
    const wrongEvent = {
      ...event,
      value: {
        ...event.value,
        name: ''
      }
    };

    await orderNotification(wrongEvent, context);

    expect(console.error).toHaveBeenCalledTimes(3);
    expect(console.error).toHaveBeenCalledWith(
      `Parameter "documentId" is invalid`
    );
    expect(console.error).toHaveBeenCalledWith(
      `Parameter "TELEGRAM_TOKEN" is invalid`
    );
    expect(console.error).toHaveBeenCalledWith(
      `Parameter "GROUP_ID" is invalid`
    );
  });
  test('console.log test when eventType is not should return "Function triggered by event undefined on: zakaz"', async () => {
    // @ts-ignore for test purposes
    context = {
      resource: 'zakaz'
    };
    await orderNotification(event, context);
    expect(console.log).toHaveBeenCalledWith(
      'Function triggered by event undefined on: zakaz'
    );
  });
});
