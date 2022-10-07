import { Telegram } from 'telegraf';
import { OrderModel, OrderStatus } from '../types';

export class OrderNotification {
  constructor(
    private order: OrderModel,
    private messenger: Telegram,
    private groupId: string
  ) {}

  private composeMessage() {
    const { API_URL } = process.env;
    const { phone, totalPrice, items, id, glovoOrderId } = this.order;
    const confirmedUrl = `${API_URL}/orders/${id}?status=${OrderStatus.CONFIRMED}`;
    const completedUrl = `${API_URL}/orders/${id}?status=${OrderStatus.COMPLETED}`;

    if (glovoOrderId === undefined) {
      return `
        <b>НОВЕ ЗАМОВЛЕННЯ!</b>
Tелефон: <a href="tel:+38${phone.replace('[^0-9]', '')}">${phone}</a>
Сума: ${totalPrice}UAH
Товари:
${items.map((item) => `${item.name}: ${item.count}шт;`).join('\n')}


<a href="${confirmedUrl}">ПІДТВЕРДЖЕНО</a>


<a href="${completedUrl}">ВИДАНО</a>`;
    } else
      return `
        <b>НОВЕ ЗАМОВЛЕННЯ! GLOVO!</b>
Tелефон: <a href="tel:+38${phone.replace('[^0-9]', '')}">${phone}</a>
Сума: ${totalPrice}UAH
Товари:
${items.map((item) => `${item.name}: ${item.count}шт;`).join('\n')}


<a href="${confirmedUrl}">ПІДТВЕРДЖЕНО</a>


<a href="${completedUrl}">ВИДАНО</a>`;
  }

  public send() {
    const message = this.composeMessage();
    return this.messenger
      .sendMessage(this.groupId, message, { parse_mode: 'HTML' })
      .then(() => console.log(`Message Send for the order: ${this.order.id}`))
      .catch((e) =>
        console.error(
          `Unable to send message for the order: ${this.order.id}`,
          e
        )
      );
  }
}
