import {
  CollectionReference,
  DocumentData,
  Firestore,
  UpdateData
} from '@google-cloud/firestore';
import { dbQuery, Product } from '../types';
import { OrderModel } from '../types';

const { PROJECT_ID, GCP_CREDENTIALS_FILE } = process.env;

const firestore = new Firestore({
  projectId: 'vash-lavash',
  timestampsInSnapshots: true,
  keyFilename: 'C:/Users/Денис/.config/gcloud/application_default_credentials.json'
});

export class Model<T = DocumentData> {
  // todo: add logging for each method
  public readonly collection: CollectionReference<T>;

  constructor(
    public readonly collectionName: string,
    private firestore: Firestore
  ) {
    this.collection = firestore.collection(
      collectionName
    ) as CollectionReference<T>;
  }

  public insertOne(data: T) {
    return this.collection.add(data);
  }

  public async insertMany(items: T[]) {
    const batch = this.firestore.batch();
    items.forEach((item) => batch.set(this.collection.doc(), item));

    return batch.commit();
  }

  public async findMany(query?: dbQuery) {
    const documents: ({ id: string } & T)[] = [];
    // get the whole collection if query not passed
    const snapshot = Array.isArray(query)
      ? await this.collection.where(...query).get()
      : await this.collection.get();

    snapshot.forEach((doc) =>
      documents.push({ id: doc.id, ...(doc.data() as T) })
    );

    return documents;
  }

  public async findOne(key: string) {
    const snapshot = await this.collection.doc(key).get();

    return { id: snapshot.id, ...(snapshot.data() as T) };
  }

  public async updateOne(key: string, data: Partial<T>) {
    const snapshot = await this.collection.doc(key).update(data as UpdateData<T>);
    
    return key
  }
}

export default {
  orders: new Model<OrderModel>('orders', firestore),
  products: new Model<Product>('products', firestore)
};
