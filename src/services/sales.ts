import { Model } from '../models';
import { dbQuery, SalesModel } from '../types';

export class SalesService {
  constructor(private readonly salesModel: Model<SalesModel>) {}

  public async getSales({ isAvailable }: { isAvailable?: boolean }) {
    let query;

    if (typeof isAvailable === 'boolean') {
      query = ['isAvailable', '==', isAvailable] as dbQuery;
    }

    return this.salesModel.findMany(query);
  }

  public async addSales(sales: SalesModel) {
    return this.salesModel.insertOne(sales);
  }

  public async updateSales(sales: { [key: string]: Partial<SalesModel> }) {
    let updatedSales = Object.entries(sales).map(([id, sales]) =>
      this.salesModel.updateOne(id, sales)
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
