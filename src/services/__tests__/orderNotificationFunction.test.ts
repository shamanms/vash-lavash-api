import { Telegram } from 'telegraf';

import db from '../../models';
import { orderNotification } from '../orderNotification';
import { OrderNotification } from '../orderNotificationClass';

jest.mock('telegraf');
jest.mock('../orderNotificationClass');
const sendMethod = jest.fn();
// @ts-ignore for test purposes
OrderNotification.mockImplementation(() => {
  return {
    send: sendMethod
  };
});

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

describe('function orderNotification', () => {
  const event = {
    value: {
      name: 'V/asya',
      fields: {},
      createTime: '1232321313',
      updateTime: '32432423423'
    }
  };
  const context = {
    eventType: 'kk/kk',
    resource: 'zakaz'
  };
  const modifiedDocument = {
    name: 'aza'
  };
  process.env = Object.assign(process.env, {
    TELEGRAM_TOKEN: 'chat',
    GROUP_ID: 'lavash'
  });

  beforeEach(() => {
    jest.resetModules();
  });
  test('should send message', async () => {
    snapshotData.mockImplementation(() => modifiedDocument);

    await orderNotification(event, context);

    expect(db.orders.collection.doc).toHaveBeenCalledWith('asya');
    expect(snapshotData).toHaveBeenCalled();
    expect(Telegram).toHaveBeenCalledWith(process.env.TELEGRAM_TOKEN as string);

    // @ts-ignore for test purposes
    const lastServiceCall = OrderNotification.mock;
    expect(lastServiceCall.calls[0][0]).toEqual(modifiedDocument);
    expect(lastServiceCall.calls[0][1]).toBeInstanceOf(Telegram);
    expect(lastServiceCall.calls[0][2]).toEqual(process.env.GROUP_ID);

    expect(sendMethod).toHaveBeenCalled();
  });

  test('should return error if data empty', async () => {
    snapshotData.mockImplementation(() => undefined);

    try {
      await orderNotification(event, context);
    } catch (e: any) {
      expect(e?.message).toMatch('Unable to get data for asya');
    }
  });
});
