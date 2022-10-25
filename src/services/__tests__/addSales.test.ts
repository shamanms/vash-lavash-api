import db from '../../models';
import services from '../index';
import { SaleModel } from '../../types';

const dbSale = {
  id: '1',
  name: 'super lavash',
  img: '',
  isAvailable: false,
  description: '2+1'
};

jest.mock('../../models', () => ({
  sales: {
    insertOne: jest.fn(),
    findMany: jest.fn(() => [dbSale])
  }
}));

describe('Service.addSales', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  test('when called with sale should add sale and return with id', async () => {
    const sale: Omit<SaleModel, 'id'> = {
      name: 'super lavash',
      img: '',
      isAvailable: false,
      description: '2+1'
    };
    // @ts-ignore for test purposes
    const result = await services.sales.addSale(sale);
    expect(db.sales.insertOne).toHaveBeenCalledWith(sale);
    expect(db.sales.findMany).toHaveBeenCalled();
    expect(result).toEqual(dbSale);
  });
});
