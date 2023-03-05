import { CloudFunctionsContext } from '@google-cloud/functions-framework';
import { Telegram } from 'telegraf';

import db from '../models';
import { OrderNotification } from './orderNotificationClass';
import services from '../services/';
import jwt from 'jsonwebtoken';

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
  console.log(
    `Function triggered by event ${context.eventType?.split('/').at(-1)} on: ${
      context.resource
    }`
  );
  const documentId = event.value.name.split('/').at(-1);
  const { TELEGRAM_TOKEN, GROUP_ID, JWT_SECRET } = process.env;

  if (documentId && TELEGRAM_TOKEN && GROUP_ID && JWT_SECRET) {
    return db.orders.collection
      .doc(documentId)
      .get()
      .then(async (snapshot) => {
        const data = snapshot.data();

        const user = await services.users.getUserByName('telegram');

        if (!user) {
          return new Error(`Unable to get telegram user data`);
        }

        if (!data) {
          return new Error(`Unable to get data for ${documentId}`);
        }

        const tg = new Telegram(TELEGRAM_TOKEN);

        await new OrderNotification(
          { ...data, id: documentId },
          tg,
          GROUP_ID,
          jwt.sign(
            {
              id: user.id,
              role: user.role
            },
            JWT_SECRET,
            {
              expiresIn: 86400 // sec = 24 hours
            }
          )
        ).send();
      });
  } else {
    Object.entries({
      documentId,
      TELEGRAM_TOKEN,
      GROUP_ID
    }).forEach(([key, value]) => {
      if (!value) {
        console.error(`Parameter "${key}" is invalid`);
      }
    });
  }
};
