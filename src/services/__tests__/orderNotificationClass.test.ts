import { OrderNotification } from '../orderNotificationClass';

const messenger = {
  sendMessage: jest.fn()
};
const groupId = 'chat';
const mode = { parse_mode: 'HTML' };
const order = {
  id: '123',
  phone: '777777777',
  totalPrice: 2000,
  isConfirmed: false,
  isCompleted: false,
  items: [
    {
      id: '321',
      name: 'bulka',
      price: 1000,
      count: 2
    }
  ],
  timestamp: Date.now()
};
const message = `
        <b>НОВЕ ЗАМОВЛЕННЯ!</b>
Tелефон: <a href="tel:+38${order.phone}">${order.phone}</a>
Сума: ${order.totalPrice}UAH
Товари:
${order.items[0].name}: ${order.items[0].count}шт;`;

describe('Class orderNotification', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('orderNotification should send message', async () => {
    jest.spyOn(console, 'log').mockImplementation();
    messenger.sendMessage.mockImplementation(() => Promise.resolve('Ok'));
    // TODO FIX MESSENGER TYPE
    // @ts-ignore for test purposes
    await new OrderNotification(order, messenger, groupId).send();

    expect(messenger.sendMessage).toHaveBeenCalledWith(groupId, message, mode);
    expect(console.log).toHaveBeenCalledWith(
      `Message Send for the order: ${order.id}`
    );
  });
  test('orderNotification should log error', async () => {
    jest.spyOn(console, 'error').mockImplementation();
    messenger.sendMessage.mockImplementation(() => Promise.reject('error'));
    // TODO FIX MESSENGER TYPE
    // @ts-ignore for test purposes
    await new OrderNotification(order, messenger, groupId).send();

    expect(messenger.sendMessage).toHaveBeenCalledWith(groupId, message, mode);
    expect(console.error).toHaveBeenCalledWith(
      `Unable to send message for the order: ${order.id}`,
      'error'
    );
  });
});
