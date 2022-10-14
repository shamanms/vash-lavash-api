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
    await this.productModel.insertMany(products);
    const existingProducts = await this.getProducts({});
    return products.map((product) =>
      existingProducts.find((dbProduct) =>
        Object.entries(product).every(
          ([key, value]) => dbProduct[key] === value
        )
      )
    );
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
    const products = await this.getProducts({ isAvailable: true });
    const typeProducts = new Set();
    products.forEach((product) => typeProducts.add(product.type));

    return Array.from(typeProducts);
  }
}
