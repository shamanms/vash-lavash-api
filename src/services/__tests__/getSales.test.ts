import db from '../../models';
import services from '../index';

jest.mock('../../models', () => ({
  sales: {
    findMany: jest.fn()
  }
}));

describe('Service.getSales', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('when called with empty object call db with undefined', async () => {
    await services.sales.getSales({});

    expect(db.sales.findMany).toHaveBeenCalledWith(undefined);
  });

  test('when called with isAvailable = true call db with query true', async () => {
    const isAvailable = true;
    await services.sales.getSales({ isAvailable });

    expect(db.sales.findMany).toHaveBeenCalledWith([
      'isAvailable',
      '==',
      isAvailable
    ]);
  });

  test('when called with isAvailable = false call db with query false', async () => {
    const isAvailable = false;
    await services.sales.getSales({ isAvailable });

    expect(db.sales.findMany).toHaveBeenCalledWith([
      'isAvailable',
      '==',
      isAvailable
    ]);
  });

  test('when called with isAvailable = null call db with undefined', async () => {
    const isAvailable = null;
    // @ts-ignore for test purposes
    await services.sales.getSales({ isAvailable });

    expect(db.sales.findMany).toHaveBeenCalledWith(undefined);
  });

  test('when called with isAvailable = "true" call db with undefined', async () => {
    const isAvailable = 'true';
    // @ts-ignore for test purposes
    await services.sales.getSales({ isAvailable });

    expect(db.sales.findMany).toHaveBeenCalledWith(undefined);
  });
});
