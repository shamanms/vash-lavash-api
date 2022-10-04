import db from '../../models';
import services from '../index';

jest.mock('../../models', () => ({
  products: {
    findMany: jest.fn(() => [
      {
        name: 'bulka',
        type: 'bulki'
      },
      { name: 'kava', type: 'napitok' }
    ])
  }
}));

describe('Service.getProductsTypes', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('when called should return products types where isAvailable true', async () => {
    const isAvailable = ['isAvailable', '==', true];
    const result = await services.products.getProductsTypes();

    expect(db.products.findMany).toHaveBeenCalledWith(isAvailable);
    expect(result).toEqual(['bulki', 'napitok']);
  });
});
