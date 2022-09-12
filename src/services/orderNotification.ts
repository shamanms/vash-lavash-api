import { CloudFunctionsContext } from '@google-cloud/functions-framework';
import { Telegram } from 'telegraf';

import db from '../models';
import { OrderNotification } from './orderNotificationClass';

interface Event {
  value: {
    name: string;
    fields: {};
    createTime: string;
    updateTime: string;
  };
}

export const orderNotification = (
  event: Event,
  context: CloudFunctionsContext
) => {
  // .at(-1) replaced to be compatible with Node 13
  console.log(
    `Function triggered by event ${context.eventType
      ?.split('/')
      .slice(-1)
      .join()} on: ${context.resource}`
  );

  // .at(-1) replaced to be compatible with Node 13
  const documentId = event.value.name.split('/').slice(-1).join();
  const { TELEGRAM_TOKEN, GROUP_ID } = process.env;

  if (documentId && TELEGRAM_TOKEN && GROUP_ID) {
    return db.orders.collection
      .doc(documentId)
      .get()
      .then((snapshot) => {
        const data = snapshot.data();
        if (!data) {
          return new Error(`Unable to get data for ${documentId}`);
        }
        const tg = new Telegram(TELEGRAM_TOKEN);

        new OrderNotification(data, tg, GROUP_ID).send();
      });
  }
};
