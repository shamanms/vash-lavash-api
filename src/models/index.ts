import { CollectionReference, DocumentData, Firestore } from '@google-cloud/firestore';
import { dbQuery, Order, Product } from "../types";

const { PROJECT_ID, GCP_CREDENTIALS_FILE } = process.env;

const firestore = new Firestore({
  projectId: PROJECT_ID,
  timestampsInSnapshots: true,
  keyFilename: GCP_CREDENTIALS_FILE
});

class Model<T = DocumentData> {// todo: add logging for each method
  private readonly collection: CollectionReference<T>;

  constructor(public readonly collectionName: string, private firestore: Firestore) {
    this.collection = firestore.collection(collectionName) as CollectionReference<T>;
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
    const documents: ({ id: string; } & T)[] = [];
    // get the whole collection if query not passed
    const snapshot = Array.isArray(query) ? await this.collection.where(...query).get() : await this.collection.get();

    snapshot.forEach((doc) => documents.push({ id: doc.id, ...doc.data() as T }))

    return documents;
  }

}

export default {
  orders: new Model<Order>('orders', firestore),
  products: new Model<Product>('products', firestore),
}