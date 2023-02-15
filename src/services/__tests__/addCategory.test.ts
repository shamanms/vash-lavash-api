import db from '../../models';
import services from '../index';
import { AdditionalItemType } from '../../types';

jest.mock('../../models', () => ({
  categories: {
    insertOne: jest.fn()
  }
}));
const category = {
  id: 'someId',
  name: 'someName',
  order: 1,
  additionalItems: [
    { type: AdditionalItemType.additives, itemId: 'someItemId1' },
    { type: AdditionalItemType.products, itemId: 'someItemId2' }
  ]
};

describe('Service.addCategory', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('when both elements updated with userId, returns both IDs', async () => {
    await services.categories.addCategory(category, 'vasyaId');

    expect(db.categories.insertOne).toHaveBeenCalledWith(category, 'vasyaId');
  });
  test('when one element true, returns ids', async () => {
    await services.categories.addCategory(category);

    expect(db.categories.insertOne).toHaveBeenCalledWith(category, undefined);
  });
});
