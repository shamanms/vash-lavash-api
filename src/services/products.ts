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

  public async updateProducts(products: { [key: string]: Partial<Product> }) {
    let updatedProducts = Object.entries(products).map(([id, product]) =>
      this.productModel.updateOne(id, product)
    );
    const updatingResult = await Promise.allSettled(updatedProducts);
    return Object.keys(products).reduce((acc, id) => {
      const dbResult = updatingResult.find(
        (updateResult) =>
          updateResult.status === 'fulfilled' && updateResult.value === id
      );
      console.log(
        'ProductsService.updateProducts:: updating result:',
        updatingResult
      );
      return {
        ...acc,
        [id]: typeof dbResult === 'object'
      };
    }, {});
  }
  public async getProductsTypes() {
    await this.getProducts({ isAvailable: true });
  }
}
