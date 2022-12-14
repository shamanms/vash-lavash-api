import { Telegram } from 'telegraf';
import { Additive, OrderModel, OrderStatus } from '../types';
import { dateTimeFormatter } from '../utils/dateTimeFormatter';

export class OrderNotification {
  constructor(
    private order: OrderModel,
    private messenger: Telegram,
    private groupId: string
  ) {}

  private composeAdditives(additives: Additive[]) {
    if (additives?.length) {
      return `
    Добавки:
      ${additives
        .map((additive) => `${additive.name}: ${additive.count}шт;`)
        .join('\n      ')}`;
    }

    return '';
  }

  private composeMessage() {
    const { API_URL } = process.env;
    const { phone, totalPrice, items, id, receivingTime, delivery } =
      this.order;
    const confirmedUrl = `${API_URL}/orders/${id}?status=${OrderStatus.CONFIRMED}`;
    const completedUrl = `${API_URL}/orders/${id}?status=${OrderStatus.COMPLETED}`;

    return `
        <b>НОВЕ ЗАМОВЛЕННЯ!</b>
Tелефон: <a href="tel:+38${phone.replace('[^0-9]', '')}">${phone}</a>
Сума: ${totalPrice}UAH
<b>Товари:</b>
  ${items
    .map((item) => `${item.name}${this.composeAdditives(item.additives)}`)
    .join('\n  ')}
Заказ оформлено на час:
  ${dateTimeFormatter(receivingTime)}
Спосіб отримання:
  ${delivery ? `Доставка за адресою: ${delivery}` : 'Самовивіз'}


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
