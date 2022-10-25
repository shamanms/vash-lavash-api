import { Telegram } from 'telegraf';
import { OrderModel, OrderStatus } from '../types';
import { dateTimeFormatter } from '../utils/dateTimeFormatter';

export class OrderNotification {
  constructor(
    private order: OrderModel,
    private messenger: Telegram,
    private groupId: string
  ) {}

  private composeMessage() {
    const { API_URL } = process.env;
    const { phone, totalPrice, items, id, receivingTime } = this.order;
    const confirmedUrl = `${API_URL}/orders/${id}?status=${OrderStatus.CONFIRMED}`;
    const completedUrl = `${API_URL}/orders/${id}?status=${OrderStatus.COMPLETED}`;

    let additiveName: string;
    let additiveCount: number;
    items.map((item) => {
      for (const additives of item.additives) {
        additiveName = additives.name;
        additiveCount = additives.count;
      }
    });

    return `
        <b>НОВЕ ЗАМОВЛЕННЯ!</b>
Tелефон: <a href="tel:+38${phone.replace('[^0-9]', '')}">${phone}</a>
Сума: ${totalPrice}UAH
Товари:
${items
  .map(
    (item) =>
      `${item.name}: ${item.count}шт; 
Добавки: ${additiveName}: ${additiveCount}шт;`
  )
  .join('\n')}
Заказ оформлено на час:
${dateTimeFormatter(receivingTime)}


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
