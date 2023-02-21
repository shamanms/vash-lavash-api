import services from '../index';
import db from '../../models';

jest.mock('../../models', () => ({
  categories: {
    findMany: jest.fn()
  }
}));

describe('Service.getCategories', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('need call db', async () => {
    await services.categories.getCategories();

    expect(db.categories.findMany).toHaveBeenCalled();
  });
});
