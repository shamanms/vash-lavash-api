import db from '../../models';
import services from '../index';
import { AdditionalItemType, CategoryModel } from '../../types';

jest.mock('../../models', () => ({
  categories: {
    insertOne: jest.fn(),
    findMany: jest.fn(() => dbCategories)
  }
}));

const dateNow = Date.now();

const dbCategories = [
  {
    id: 'someId',
    name: 'someName',
    order: 1,
    additionalItems: [
      { type: AdditionalItemType.comboMenu, itemId: 'someItemId1' },
      { type: AdditionalItemType.sales, itemId: 'someItemId2' }
    ],
    create: { createdBy: 'vasyaId', createdAt: dateNow }
  },
  {
    id: 'someId2',
    name: 'someName2',
    order: 2,
    additionalItems: [
      { type: AdditionalItemType.comboMenu, itemId: 'someItemId1' },
      { type: AdditionalItemType.sales, itemId: 'someItemId2' }
    ],
    create: { createdBy: undefined, createdAt: dateNow }
  }
];

describe('Service.addCategory', () => {
  beforeEach(() => {
    jest.resetModules();
    global.Date.now = jest.fn(() => dateNow);
  });

  test('when called with category, and userId should add category with createInfo and return with id', async () => {
    const category: Omit<CategoryModel, 'id'> = {
      name: 'someName',
      order: 1,
      additionalItems: [
        { type: AdditionalItemType.comboMenu, itemId: 'someItemId1' },
        { type: AdditionalItemType.sales, itemId: 'someItemId2' }
      ]
    };
    // @ts-ignore for test purposes
    const result = await services.categories.addCategory(category, 'vasyaId');
    expect(db.categories.insertOne).toHaveBeenCalledWith(category, 'vasyaId');
    expect(db.categories.findMany).toHaveBeenCalled();
    expect(result).toEqual(dbCategories[0]);
  });
  test('when called with category, and without userId should add category with createInfo with time and return with id', async () => {
    const category: Omit<CategoryModel, 'id'> = {
      name: 'someName2',
      order: 2,
      additionalItems: [
        { type: AdditionalItemType.comboMenu, itemId: 'someItemId1' },
        { type: AdditionalItemType.sales, itemId: 'someItemId2' }
      ]
    };

    // @ts-ignore for test purposes
    const result = await services.categories.addCategory(category);
    expect(db.categories.insertOne).toHaveBeenCalledWith(category, undefined);
    expect(db.categories.findMany).toHaveBeenCalled();
    expect(result).toEqual(dbCategories[1]);
  });
});
