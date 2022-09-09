import { Telegram } from 'telegraf';
import { OrderModel } from '../types';


export class OrderNotification {
    constructor(
      private order: OrderModel,
      private messenger: Telegram,
      private groupId: string
    ) {}
  
    private composeMessage() {
      const { phone, totalPrice, items } = this.order;
  
      return `
        <b>НОВЕ ЗАМОВЛЕННЯ!</b>
  Tелефон: <a href="tel:+38${phone.replace('[^0-9]', '')}">${phone}</a>
  Сума: ${totalPrice}UAH
  Товари:
  ${items.map((item) => `${item.name}: ${item.count}шт;`).join('\n')}`;
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
  