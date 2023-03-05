import { Telegram } from 'telegraf';
import {
  OrderedAdditive,
  OrderModel,
  OrderStatus,
  OrderedComboMenu
} from '../types';
import { dateTimeFormatter } from '../utils/dateTimeFormatter';

export class OrderNotification {
  constructor(
    private order: OrderModel,
    private messenger: Telegram,
    private groupId: string,
    private token: string
  ) {}

  private composeAdditives(additives: OrderedAdditive[]) {
    if (additives?.length) {
      return `
    Додатки:
      ${additives
        .map((additive) => `${additive.name}: ${additive.count}шт;`)
        .join('\n      ')}`;
    }

    return '';
  }

  private composeComboMenus(comboMenus: OrderedComboMenu[]) {
    if (comboMenus?.length) {
      return `
---

<b>Комбо меню:</b>
  ${comboMenus
    .map(
      (comboMenu) =>
        `${comboMenu.name}: 
    ${comboMenu.products.map((product) => product.name).join('\n    ')}`
    )
    .join('\n  ')}`;
    }

    return '';
  }

  private composeUrl(status: OrderStatus, id?: string) {
    const { API_URL } = process.env;

    return `${API_URL}/orders/${id}?status=${status}&auth=${this.token}`;
  }

  private composeMessage() {
    const {
      phone,
      totalPrice,
      items,
      id,
      receivingTime,
      delivery,
      comboMenus
    } = this.order;
    const confirmedUrl = this.composeUrl(OrderStatus.CONFIRMED, id);
    const completedUrl = this.composeUrl(OrderStatus.COMPLETED, id);

    return `
        <b>НОВЕ ЗАМОВЛЕННЯ!</b>
Tелефон замовника: <a href="tel:+38${phone.replace('[^0-9]', '')}">${phone}</a>
Сума: ${totalPrice}UAH
Заказ оформлено на час:
  ${dateTimeFormatter(receivingTime)}
Спосіб отримання:
  ${delivery ? `Доставка за адресою: ${delivery}` : 'Самовивіз'}
${
  items.length > 0
    ? `
---

<b>Товари:</b>
  ${items
    .map((item) => `${item.name}${this.composeAdditives(item.additives)}`)
    .join('\n  ')}`
    : ''
}
${comboMenus.length > 0 ? `${this.composeComboMenus(comboMenus)}` : ''}


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
