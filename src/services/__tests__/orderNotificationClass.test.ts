import { OrderNotification } from '../orderNotificationClass';
import { OrderStatus } from '../../types';

const messenger = {
  sendMessage: jest.fn()
};
const groupId = 'chat';
const mode = { parse_mode: 'HTML' };
let order = {
  id: '123',
  phone: '777777777',
  totalPrice: 2000,
  status: OrderStatus.NOT_CONFIRMED,
  items: [
    {
      id: '321',
      name: 'bulka',
      price: 1000,
      count: 2
    }
  ],
  timestamp: Date.now(),
  glovoOrderId: '1234',
  pickUpCode: '555'
};
const API_URL = 'http://test.url';
let message = `
        <b>НОВЕ ЗАМОВЛЕННЯ! ${order.glovoOrderId ? 'GLOVO!' : ''}</b>
Tелефон: <a href="tel:+38${order.phone}">${order.phone}</a>
Сума: ${order.totalPrice}UAH
Товари:
${order.items[0].name}: ${order.items[0].count}шт;
${order.glovoOrderId ? `Код: ${order.pickUpCode}` : ''}


<a href="${API_URL}/orders/${order.id}?status=${
  OrderStatus.CONFIRMED
}">ПІДТВЕРДЖЕНО</a>


<a href="${API_URL}/orders/${order.id}?status=${
  OrderStatus.COMPLETED
}">ВИДАНО</a>`;

describe('Class orderNotification', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.API_URL = API_URL;
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('orderNotification should send glovo message', async () => {
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
  test('orderNotification should send website message', async () => {
    // @ts-ignore
    order = {
      id: '123',
      phone: '777777777',
      totalPrice: 2000,
      status: OrderStatus.NOT_CONFIRMED,
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

    message = `
        <b>НОВЕ ЗАМОВЛЕННЯ! ${order.glovoOrderId ? 'GLOVO!' : ''}</b>
Tелефон: <a href="tel:+38${order.phone}">${order.phone}</a>
Сума: ${order.totalPrice}UAH
Товари:
${order.items[0].name}: ${order.items[0].count}шт;
${order.glovoOrderId ? `Код: ${order.pickUpCode}` : ''}


<a href="${API_URL}/orders/${order.id}?status=${
      OrderStatus.CONFIRMED
    }">ПІДТВЕРДЖЕНО</a>


<a href="${API_URL}/orders/${order.id}?status=${
      OrderStatus.COMPLETED
    }">ВИДАНО</a>`;

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
