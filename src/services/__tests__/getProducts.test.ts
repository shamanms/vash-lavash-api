import { getProducts } from '../index';
import db from '../../models';

jest.mock('../../models', () => ({
  products: {
    findMany: jest.fn()
  }
}));

describe('Service.getProducts', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('when called with empty object call db with undefined', async () => {
    await getProducts({});

    expect(db.products.findMany).toHaveBeenCalledWith(undefined);
  });

  test('when called with isAvailable = true call db with query true', async () => {
    const isAvailable = true;
    await getProducts({ isAvailable });

    expect(db.products.findMany).toHaveBeenCalledWith([
      'isAvailable',
      '==',
      isAvailable
    ]);
  });

  test('when called with isAvailable = false call db with query false', async () => {
    const isAvailable = false;
    await getProducts({ isAvailable });

    expect(db.products.findMany).toHaveBeenCalledWith([
      'isAvailable',
      '==',
      isAvailable
    ]);
  });

  test('when called with isAvailable = null call db with undefined', async () => {
    const isAvailable = null;
    // @ts-ignore for test purposes
    await getProducts({ isAvailable });

    expect(db.products.findMany).toHaveBeenCalledWith(undefined);
  });

  test('when called with isAvailable = "true" call db with undefined', async () => {
    const isAvailable = 'true';
    // @ts-ignore for test purposes
    await getProducts({ isAvailable });

    expect(db.products.findMany).toHaveBeenCalledWith(undefined);
  });
});
