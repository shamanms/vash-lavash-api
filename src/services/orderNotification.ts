import { CloudFunctionsContext } from '@google-cloud/functions-framework';
import { Telegram } from 'telegraf';

import db from '../models';
import { OrderModel } from "../types";

interface Event {
  value: {
    name: string;
    fields: {};
    createTime: string;
    updateTime: string;
  }
}

export const orderNotification = (event: Event, context: CloudFunctionsContext) => {
  console.log(`Function triggered by event ${context.eventType?.split('/').at(-1)} on: ${context.resource}`);

  const documentId = event.value.name.split('/').at(-1);
  const { TELEGRAM_TOKEN, GROUP_ID } = process.env;

  if (documentId && TELEGRAM_TOKEN && GROUP_ID) {
    db.orders.collection.doc(documentId).get().then((snapshot) => {
      const data = snapshot.data();
      if (!data) {
        return new Error(`Unable to get data for ${documentId}`);
      }
      const tg = new Telegram(TELEGRAM_TOKEN);

      new OrderNotification(data, tg, GROUP_ID).send();
    });
  }
};

class OrderNotification {
  constructor(private order: OrderModel, private messenger: Telegram, private groupId: string) {}

  private composeMessage() {
    const { phone, totalPrice, items } = this.order;

    return `
      <b>НОВЕ ЗАМОВЛЕННЯ!</b>
Tелефон: <a href="tel:+38${phone.replace("[^0-9]", '')}">${phone}</a>
Сума: ${totalPrice}UAH
Товари:
${items.map(item => `${item.name}: ${item.count}шт;`).join('\n')}`;
  }

  public send() {
    const message = this.composeMessage();
    this.messenger.sendMessage(this.groupId, message, { parse_mode: "HTML" })
      .then(() => console.log(`Message Send for the order: ${this.order.id}`))
      .catch((e) => console.error(`Unable to send message for the order: ${this.order.id}`, e))
  }
}
