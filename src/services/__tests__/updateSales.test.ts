import db from '../../models';
import services from '../index';

jest.mock('../../models', () => ({
  sales: {
    updateOne: jest.fn()
  }
}));
const sales = {
  '1': {
    description: '',
    isAvailable: false
  },
  '2': {
    description: '',
    isAvailable: false
  }
};
jest.spyOn(console, 'log').mockImplementation();

describe('Service.updateSales', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('when both elements updated, returns both IDs true', async () => {
    // @ts-ignore for test purposes
    db.sales.updateOne.mockImplementation((id) => id);
    const result = await services.sales.updateSales(sales);
    Object.entries(sales).forEach(([id, sale], index) => {
      expect(db.sales.updateOne).toHaveBeenNthCalledWith(index + 1, id, sale);
    });
    const expectedResult = {
      '1': true,
      '2': true
    };
    expect(result).toEqual(expectedResult);
  });
  test('when one element failed, returns true and false', async () => {
    db.sales.updateOne
      // @ts-ignore for test purposes
      .mockReturnValueOnce('1')
      .mockReturnValueOnce(new Error());
    const result = await services.sales.updateSales(sales);
    const expectedResult = {
      '1': true,
      '2': false
    };
    expect(result).toEqual(expectedResult);
  });
  test('when both failed, returns both false', async () => {
    db.sales.updateOne
      // @ts-ignore for test purposes
      .mockReturnValueOnce(new Error())
      .mockReturnValueOnce(new Error());
    const result = await services.sales.updateSales(sales);
    const expectedResult = {
      '1': false,
      '2': false
    };
    expect(result).toEqual(expectedResult);
  });
});
