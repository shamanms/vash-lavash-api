import { Firestore } from '@google-cloud/firestore';

const { PROJECT_ID, GCP_CREDENTIALS_FILE } = process.env;

const firestore = new Firestore({
  projectId: PROJECT_ID,
  timestampsInSnapshots: true,
  keyFilename: GCP_CREDENTIALS_FILE
});

class Model {// todo: add logging for each method
  private collection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;

  constructor(private collectionName: string) {
    this.collection = firestore.collection(collectionName);
  }

  public insert(data) {
    return this.collection.add(data);
  }

  public async findMany() {
    const documentReferences = await this.collection.listDocuments();
    const documents = [];

    for (const documentReference of documentReferences) {
      const data = await documentReference.get();
      documents.push({ id: data.id, ...data.data() });
    }

    return documents;
  }

}

export default {
  orders: new Model('orders'),
  products: new Model('products'),
}