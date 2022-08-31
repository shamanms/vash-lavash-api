import { CollectionReference, DocumentData, Firestore } from '@google-cloud/firestore';
import { Order, Product } from "../types";

const { PROJECT_ID, GCP_CREDENTIALS_FILE } = process.env;

const firestore = new Firestore({
  projectId: PROJECT_ID,
  timestampsInSnapshots: true,
  keyFilename: GCP_CREDENTIALS_FILE
});

class Model<T = DocumentData> {// todo: add logging for each method
  private readonly collection: CollectionReference<T>;

  constructor(collectionName: string, private firestore: Firestore) {
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

  public async findMany() {
    const documentReferences = await this.collection.listDocuments();
    const documents = [];

    for (const documentReference of documentReferences) {
      const data = await documentReference.get();
      documents.push({ id: data.id, ...data.data() as T });
    }

    return documents;
  }

}

export default {
  orders: new Model<Order>('orders', firestore),
  products: new Model<Product>('products', firestore),
}