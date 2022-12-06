import db from '../../models';
import services from '../index';

jest.mock('../../models', () => ({
  products: {
    updateOne: jest.fn()
  }
}));
const products = {
  '1': {
    img: '',
    description: '',
    name: 'Тома пурі',
    isAvailable: false,
    price: 10,
    type: 'Випічка дріжджова'
  },
  '2': {
    price: 10,
    description: '',
    name: 'Пені пурі з шинкою та сиром',
    img: '',
    type: 'Паляниці ХХL',
    isAvailable: false
  }
};
jest.spyOn(console, 'log').mockImplementation();

describe('Service.updateProducts', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('when both elements updated with userId, returns both IDs true', async () => {
    // @ts-ignore for test purposes
    db.products.updateOne.mockImplementation((id) => id);
    const result = await services.products.updateProducts(products, 'vasyaId');
    Object.entries(products)
      .filter(([, value]) => typeof value !== 'object')
      .forEach(([id, product], index) => {
        expect(db.products.updateOne).toHaveBeenNthCalledWith(
          index + 1,
          id,
          product
        );
      });
    const expectedResult = {
      '1': true,
      '2': true
    };
    expect(result).toEqual(expectedResult);
  });
  test('when one element failed, returns true and false', async () => {
    db.products.updateOne
      // @ts-ignore for test purposes
      .mockReturnValueOnce('1')
      .mockReturnValueOnce(new Error());
    const result = await services.products.updateProducts(products);
    const expectedResult = {
      '1': true,
      '2': false
    };
    expect(result).toEqual(expectedResult);
  });
  test('when both failed, returns both false', async () => {
    db.products.updateOne
      // @ts-ignore for test purposes
      .mockReturnValueOnce(new Error())
      .mockReturnValueOnce(new Error());
    const result = await services.products.updateProducts(products);
    const expectedResult = {
      '1': false,
      '2': false
    };
    expect(result).toEqual(expectedResult);
  });
});
