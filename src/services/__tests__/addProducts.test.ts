import db from '../../models';
import { Product } from '../../types';
import services from '../index';

const productOne = {
  id: '10',
  name: 'bulka',
  price: 10,
  description: '',
  img: '',
  type: '',
  isAvailable: false
};
const productTwo = {
  id: '12',
  name: 'sloika',
  price: 15,
  description: '',
  img: '',
  type: '',
  isAvailable: false
};
jest.mock('../../models', () => ({
  products: {
    insertMany: jest.fn(),
    findMany: jest.fn(() => [productOne, productTwo])
  }
}));

describe('Service.addProducts', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  test('when called with products should add product and return with id', async () => {
    const products: Omit<Product, 'id'>[] = [
      {
        name: 'bulka',
        price: 10,
        description: '',
        img: '',
        type: '',
        isAvailable: false
      }
    ];
    // @ts-ignore
    const result = await services.products.addProducts(products);
    expect(db.products.insertMany).toHaveBeenCalledWith(products);
    expect(db.products.findMany).toHaveBeenCalled();
    expect(result).toEqual([productOne]);
  });
});
