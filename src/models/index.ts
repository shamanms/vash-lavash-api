import { Firestore } from '@google-cloud/firestore';

const { PROJECT_ID, GCP_CREDENTIALS_FILE } = process.env;

const firestore = new Firestore({
  projectId: PROJECT_ID,
  timestampsInSnapshots: true,
  keyFilename: GCP_CREDENTIALS_FILE
});

export default {
  orders: firestore.collection('orders'),
  products: firestore.collection('products'),
}