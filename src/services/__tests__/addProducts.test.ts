import { addProducts } from '../index';
import db from '../../models';
import { Product } from '../../types';

jest.mock('../../models', () => ({
  products: {
    insertMany: jest.fn()
  }
}));

describe('Service.addProducts', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  test('when called with products = [] call db with products', async () => {
    const products: Product[] = [];
    await addProducts(products);
    expect(db.products.insertMany).toHaveBeenCalledWith(products);
  });

  test('when called with products = string call db with string', async () => {
    // @ts-ignore for test purposes
    await addProducts(['string']);
    expect(db.products.insertMany).toHaveBeenCalledWith(['string']);
  });

  test('when called with products = null call db with null', async () => {
    // @ts-ignore for test purposes
    await addProducts([null]);
    expect(db.products.insertMany).toHaveBeenCalledWith([null]);
  });
});
