import db from '../../models';
import services from '../index';

jest.mock('../../models', () => ({
  products: {
    updateOne: jest.fn()
  }
}));
const products = [
  {
    id: '0fNni89debIQtGIVQB2g',
    img: '',
    description: '',
    name: 'Тома пурі',
    isAvailable: false,
    price: 10,
    type: 'Випічка дріжджова'
  },
  {
    id: '2DRPO7YiNxnjAGTIhs50',
    price: 10,
    description: '',
    name: 'Пені пурі з шинкою та сиром',
    img: '',
    type: 'Паляниці ХХL',
    isAvailable: false
  }
];
jest.spyOn(console, 'log').mockImplementation();

describe('updateProducts function', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('when both elements updated, returns both IDs true', async () => {
    // @ts-ignore for test purposes
    db.products.updateOne.mockImplementation((id) => id);
    const result = await services.products.updateProducts(products);
    products.forEach((product, index) => {
      expect(db.products.updateOne).toHaveBeenNthCalledWith(
        index + 1,
        product.id,
        product
      );
    });
    const expectedResult = {
      [products[0].id]: true,
      [products[1].id]: true
    };
    expect(result).toEqual(expectedResult);
  });
  test('when one element failed, returns true and false', async () => {
    db.products.updateOne
      // @ts-ignore for test purposes
      .mockReturnValueOnce(products[0].id)
      .mockReturnValueOnce(new Error());
    const result = await services.products.updateProducts(products);
    const expectedResult = {
      [products[0].id]: true,
      [products[1].id]: false
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
      [products[0].id]: false,
      [products[1].id]: false
    };
    expect(result).toEqual(expectedResult);
  });
});
