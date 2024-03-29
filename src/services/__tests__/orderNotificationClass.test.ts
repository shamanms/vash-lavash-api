import { OrderNotification } from '../orderNotificationClass';
import { OrderModel, OrderStatus } from '../../types';
import { dateTimeFormatter } from '../../utils/dateTimeFormatter';

const messenger = {
  sendMessage: jest.fn()
};
const groupId = 'chat';
const mode = { parse_mode: 'HTML' };
let order: OrderModel = {
  id: '123',
  delivery: 'home',
  phone: '777777777',
  totalPrice: 3038,
  orderStatus: OrderStatus.NOT_CONFIRMED,
  items: [
    {
      id: '321',
      name: 'bulka',
      price: 1000,
      additives: []
    },
    {
      id: '321',
      name: 'bulka',
      price: 1000,
      additives: [
        {
          id: 'id',
          name: 'perec',
          price: 11,
          count: 2
        },
        {
          id: 'id',
          name: 'sol',
          price: 5,
          count: 1
        }
      ]
    },
    {
      id: '456',
      name: 'pizza',
      price: 500,
      additives: [
        {
          id: 'id',
          name: 'perec',
          price: 11,
          count: 1
        },
        {
          id: 'id',
          name: 'sol',
          price: 5,
          count: 1
        }
      ]
    }
  ],
  comboMenus: [
    {
      name: 'comboMenuName1',
      id: '111',
      price: 100,
      products: [
        { id: '123', price: 10, name: 'comboMenuProduct1' },
        { id: '321', price: 10, name: 'comboMenuProduct2' }
      ]
    },
    {
      name: 'comboMenuName2',
      id: '222',
      price: 100,
      products: [
        { id: '123', price: 10, name: 'comboMenuProduct12' },
        { id: '321', price: 10, name: 'comboMenuProduct22' }
      ]
    }
  ],
  timestamp: Date.now(),
  receivingTime: new Date().setHours(12, 10, 15)
};
const API_URL = 'http://test.url';
const token = 'testToken';
// prettier-ignore
let message = `
        <b>НОВЕ ЗАМОВЛЕННЯ!</b>
Tелефон замовника: <a href="tel:+38${order.phone}">${order.phone}</a>
Сума: ${order.totalPrice}UAH
Заказ оформлено на час:
  ${dateTimeFormatter(order.receivingTime)}
Спосіб отримання:
  ${order.delivery ? `Доставка за адресою: ${order.delivery}` : 'Самовивіз'}

---

<b>Товари:</b>
  ${order.items[0].name}
  ${order.items[1].name}
    Додатки:
      ${order.items[1].additives[0].name}: ${order.items[1].additives[0].count}шт;
      ${order.items[1].additives[1].name}: ${order.items[1].additives[1].count}шт;
  ${order.items[2].name}
    Додатки:
      ${order.items[2].additives[0].name}: ${order.items[2].additives[0].count}шт;
      ${order.items[2].additives[1].name}: ${order.items[2].additives[1].count}шт;

---

<b>Комбо меню:</b>
  ${order.comboMenus[0].name}: 
    ${order.comboMenus[0].products[0].name}
    ${order.comboMenus[0].products[1].name}
  ${order.comboMenus[1].name}: 
    ${order.comboMenus[1].products[0].name}
    ${order.comboMenus[1].products[1].name}


<a href="${API_URL}/orders/${order.id}?status=${
  OrderStatus.CONFIRMED
}&auth=${token}">ПІДТВЕРДЖЕНО</a>


<a href="${API_URL}/orders/${order.id}?status=${
  OrderStatus.COMPLETED
}&auth=${token}">ВИДАНО</a>`;

describe('Class orderNotification', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.API_URL = API_URL;
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('orderNotification should send message', async () => {
    jest.spyOn(console, 'log').mockImplementation();
    messenger.sendMessage.mockImplementation(() => Promise.resolve('Ok'));
    // TODO FIX MESSENGER TYPE
    // @ts-ignore for test purposes
    await new OrderNotification(order, messenger, groupId, token).send();

    expect(messenger.sendMessage).toHaveBeenCalledWith(groupId, message, mode);
    expect(console.log).toHaveBeenCalledWith(
      `Message Send for the order: ${order.id}`
    );
  });
  test('orderNotification should send message', async () => {
    order = {
      id: '123',
      delivery: null,
      phone: '777777777',
      totalPrice: 3038,
      orderStatus: OrderStatus.NOT_CONFIRMED,
      items: [
        {
          id: '321',
          name: 'bulka',
          price: 1000,
          additives: []
        }
      ],
      comboMenus: [],
      timestamp: Date.now(),
      receivingTime: new Date().setHours(12, 10, 15)
    };
    // prettier-ignore
    message = `
        <b>НОВЕ ЗАМОВЛЕННЯ!</b>
Tелефон замовника: <a href="tel:+38${order.phone}">${order.phone}</a>
Сума: ${order.totalPrice}UAH
Заказ оформлено на час:
  ${dateTimeFormatter(order.receivingTime)}
Спосіб отримання:
  ${order.delivery ? `Доставка за адресою: ${order.delivery}` : 'Самовивіз'}

---

<b>Товари:</b>
  ${order.items[0].name}



<a href="${API_URL}/orders/${order.id}?status=${
      OrderStatus.CONFIRMED
    }&auth=${token}">ПІДТВЕРДЖЕНО</a>


<a href="${API_URL}/orders/${order.id}?status=${
      OrderStatus.COMPLETED
    }&auth=${token}">ВИДАНО</a>`;

    jest.spyOn(console, 'log').mockImplementation();
    messenger.sendMessage.mockImplementation(() => Promise.resolve('Ok'));
    // TODO FIX MESSENGER TYPE
    // @ts-ignore for test purposes
    await new OrderNotification(order, messenger, groupId, token).send();

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
    await new OrderNotification(order, messenger, groupId, token).send();

    expect(messenger.sendMessage).toHaveBeenCalledWith(groupId, message, mode);
    expect(console.error).toHaveBeenCalledWith(
      `Unable to send message for the order: ${order.id}`,
      'error'
    );
  });
});
