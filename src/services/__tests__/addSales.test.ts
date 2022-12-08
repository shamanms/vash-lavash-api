import db from '../../models';
import services from '../index';
import { SaleModel } from '../../types';

const dateNow = Date.now();

const dbSales = [
  {
    id: '1',
    name: 'super lavash',
    img: '',
    isAvailable: false,
    description: '2+1',
    create: { createdBy: 'vasyaId', createdAt: dateNow }
  },
  {
    id: '2',
    name: 'super bulka',
    img: '',
    isAvailable: false,
    description: '1+1',
    create: { createdBy: undefined, createdAt: dateNow }
  }
];

jest.mock('../../models', () => ({
  sales: {
    insertOne: jest.fn(),
    findMany: jest.fn(() => dbSales)
  }
}));

describe('Service.addSales', () => {
  beforeEach(() => {
    jest.resetModules();
    global.Date.now = jest.fn(() => dateNow);
  });
  test('when called with sale and userId should add sale with createInfo and return with id', async () => {
    const sale: Omit<SaleModel, 'id'> = {
      name: 'super lavash',
      img: '',
      isAvailable: false,
      description: '2+1'
    };
    // @ts-ignore for test purposes
    const result = await services.sales.addSale(sale, 'vasyaId');
    expect(db.sales.insertOne).toHaveBeenCalledWith(sale, 'vasyaId');
    expect(db.sales.findMany).toHaveBeenCalled();
    expect(result).toEqual(dbSales[0]);
  });
  test('when called with sale and without userId should add sale with createInfo with time and return with id', async () => {
    const sale: Omit<SaleModel, 'id'> = {
      id: '2',
      name: 'super bulka',
      img: '',
      isAvailable: false,
      description: '1+1'
    };
    // @ts-ignore for test purposes
    const result = await services.sales.addSale(sale);
    expect(db.sales.insertOne).toHaveBeenCalledWith(sale, undefined);
    expect(db.sales.findMany).toHaveBeenCalled();
    expect(result).toEqual(dbSales[1]);
  });
});
