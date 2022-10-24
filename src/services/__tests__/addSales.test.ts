import db from '../../models';
import services from '../index';

jest.mock('../../models', () => ({
  sales: {
    insertOne: jest.fn()
  }
}));

describe('Service.addSales', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  test('when called with sales = {} call db with vacancies', async () => {
    // @ts-ignore for test purposes
    await services.sales.addSales({});
    expect(db.sales.insertOne).toHaveBeenCalledWith({});
  });

  test('when called with sales = string call db with string', async () => {
    // @ts-ignore for test purposes
    await services.sales.addSales(['string']);
    expect(db.sales.insertOne).toHaveBeenCalledWith(['string']);
  });

  test('when called with sales = null call db with null', async () => {
    // @ts-ignore for test purposes
    await services.sales.addSales([null]);
    expect(db.sales.insertOne).toHaveBeenCalledWith([null]);
  });
});
