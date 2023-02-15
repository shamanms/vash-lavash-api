import db from '../../models';
import services from '../index';

jest.mock('../../models', () => ({
  categories: {
    updateOne: jest.fn()
  }
}));
const category = {
  '1': {
    name: '',
    order: 1
  }
};

describe('Service.updateCategory', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('when both elements updated with userId, returns both IDs', async () => {
    // @ts-ignore for test purposes
    db.categories.updateOne.mockImplementation((id) => id);
    const result = await services.categories.updateCategory(
      '1',
      category['1'],
      'vasyaId'
    );
    Object.entries(category)
      .filter(([, value]) => typeof value !== 'object')
      .forEach(([id, comboMenu], index) => {
        expect(db.categories.updateOne).toHaveBeenNthCalledWith(
          index + 1,
          id,
          comboMenu
        );
      });
    expect(db.categories.updateOne).toHaveBeenCalledWith(
      '1',
      category['1'],
      'vasyaId'
    );
    expect(result).toEqual('1');
  });
  test('when one element true, returns ids', async () => {
    db.categories.updateOne
      // @ts-ignore for test purposes
      .mockReturnValueOnce('1');
    const result = await services.categories.updateCategory('1', category['1']);
    expect(db.categories.updateOne).toHaveBeenCalledWith(
      '1',
      category['1'],
      undefined
    );
    expect(result).toEqual('1');
  });
});
