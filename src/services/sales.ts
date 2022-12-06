import { Model } from '../models';
import { dbQuery, SaleModel } from '../types';

export class SalesService {
  constructor(private readonly salesModel: Model<SaleModel>) {}

  public async getSales({ isAvailable }: { isAvailable?: boolean }) {
    let query;

    if (typeof isAvailable === 'boolean') {
      query = ['isAvailable', '==', isAvailable] as dbQuery;
    }

    return this.salesModel.findMany(query);
  }

  public async addSale(sale: SaleModel, userId?: string) {
    await this.salesModel.insertOne(sale, userId);
    const existingSale = await this.getSales({});
    return existingSale.find((dbSale) =>
      Object.entries(sale)
        .filter(([, value]) => typeof value !== 'object')
        .every(([key, value]) => dbSale[key] === value)
    );
  }

  public async updateSales(
    sales: { [key: string]: Partial<SaleModel> },
    userId?: string
  ) {
    let updatedSales = Object.entries(sales).map(([id, sales]) =>
      this.salesModel.updateOne(id, sales, userId)
    );
    const updatingResult = await Promise.allSettled(updatedSales);
    return Object.keys(sales).reduce((acc, id) => {
      const dbResult = updatingResult.find(
        (updateResult) =>
          updateResult.status === 'fulfilled' && updateResult.value === id
      );
      console.log(
        'SalesService.updateSales:: updating result:',
        updatingResult
      );
      return {
        ...acc,
        [id]: typeof dbResult === 'object'
      };
    }, {});
  }
}
