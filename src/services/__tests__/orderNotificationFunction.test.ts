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
  process.env = Object.assign(process.env, {
    TELEGRAM_TOKEN: 'chat',
    GROUP_ID: 'lavash'
  });

  beforeEach(() => {
    jest.resetModules();
  });
  test('should send message', async () => {
    snapshotData.mockImplementation(() => ({
      name: 'aza'
    }));
    await orderNotification(event, context);
    expect(db.orders.collection.doc).toHaveBeenCalledWith('asya');
    expect(snapshotData).toHaveBeenCalledWith('aza');
    expect(OrderNotification).toHaveBeenCalledWith('aza', 'chat', 'lavash');
    expect(sendMethod).toHaveBeenCalled();
  });

  test('should return error if data empty', async () => {
    await orderNotification(event, context);
    snapshotData.mockImplementation(() => undefined);
    expect(snapshotData).toHaveBeenCalledWith(undefined);
    try {
      await snapshotData();
    } catch (e: any) {
      expect(e?.message).toMatch(`Unable to get data for asya`);
    }
  });
});
