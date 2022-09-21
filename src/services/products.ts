import { Model } from '../models';
import { dbQuery, Product } from '../types';

export class ProductsService {
  constructor(private readonly productModel: Model<Product>) {}

  public async getProducts({ isAvailable }: { isAvailable?: boolean }) {
    let query;

    if (typeof isAvailable === 'boolean') {
      query = ['isAvailable', '==', isAvailable] as dbQuery;
    }

    return this.productModel.findMany(query);
  }

  public async addProducts(products: Product[]) {
    return this.productModel.insertMany(products);
  }

  public async updateProducts(products: Product[]) {
    let updatedProducts = products.map((product) =>
      this.productModel.updateOne(product.id, product)
    );
    const updatingResult = await Promise.allSettled(updatedProducts);
    return products.reduce((acc, { id }) => {
      const dbResult = updatingResult.find(
        (updateResult) =>
          updateResult.status === 'fulfilled' && updateResult.value === id
      );
      console.log(updatingResult);
      return {
        ...acc,
        [id]: typeof dbResult === 'object'
      };
    }, {});
  }
}
