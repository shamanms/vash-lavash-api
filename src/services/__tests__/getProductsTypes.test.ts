import db from '../../models';
import services from '../index';

jest.mock('../../models', () => ({
  products: {
    findMany: jest.fn()
  }
}));

describe('Service.getProductsTypes', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('when called should return products where isAvailable true', async () => {
    const isAvailable = ['isAvailable', '==', true];
    await services.products.getProductsTypes();

    expect(db.products.findMany).toHaveBeenCalledWith(isAvailable);
  });
});
