import {
  CollectionReference,
  DocumentData,
  Firestore,
  UpdateData
} from '@google-cloud/firestore';
import {
  AdditivesModel,
  dbQuery,
  Product,
 SaleModel, UserModel,
  VacancyModel
} from '../types';
import { OrderModel } from '../types';

const { PROJECT_ID, GCP_CREDENTIALS_FILE } = process.env;

const firestore = new Firestore({
  projectId: PROJECT_ID,
  timestampsInSnapshots: true,
  keyFilename: GCP_CREDENTIALS_FILE
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

  public async findOneById(key: string) {
    const snapshot = await this.collection.doc(key).get();

    const data = snapshot.data();

    if (typeof data === 'object') {
      return { id: key, ...data };
    }

    return data;
  }

  public async updateOne(id: string, data: Partial<T>) {
    await this.collection.doc(id).update(data as UpdateData<T>);

    return id;
  }
}

export default {
  orders: new Model<OrderModel>('orders', firestore),
  products: new Model<Product>('products', firestore),
  vacancies: new Model<VacancyModel>('vacancies', firestore),
  users: new Model<UserModel>('users', firestore),
  additives: new Model<AdditivesModel>('additives', firestore),
  sales: new Model<SaleModel>('sales', firestore)
};
