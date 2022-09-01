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

  if (documentId) {
    db.orders.collection.doc(documentId).get().then((snapshot) => {
      const data = snapshot.data();
      sendNotification(data);
    });
  }
};

const sendNotification = (data:  OrderModel | undefined) => {
  const { TELEGRAM_TOKEN, GROUP_ID } = process.env;

  if (!TELEGRAM_TOKEN) {
    throw new Error('Incorrect TELEGRAM_TOKEN');
  }

  if (!GROUP_ID) {
    throw new Error('Incorrect GROUP_ID');
  }

  const tg = new Telegram(TELEGRAM_TOKEN);
  // const message = createTelegramMessage(build);
  // const duration = humanizeDuration(new Date(build.finishTime) - new Date(build.startTime));
  // const msgText = `<br><br>Build ${build.id} finished with status ${build.status}, in ${duration}.`;
  // let msgHtml = `${msgText}<br><a href="${build.logUrl}">Build logs</a>`;
  // if (build.images) {
  //   const images = build.images.join(',');
  //   msgHtml += `Images: ${images}`;
  // }

  tg.sendMessage(GROUP_ID, 'Test', { parse_mode: "HTML" })
    .then(() => console.log('Message Send'))
    .catch((e) => console.error(e))
};