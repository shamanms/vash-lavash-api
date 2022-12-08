import db from '../../models';
import { Product } from '../../types';
import services from '../index';

const dateNow = Date.now();

const dbProducts = [
  {
    id: '10',
    name: 'bulka',
    price: 10,
    description: '',
    img: '',
    type: '',
    isAvailable: false,
    create: { createdBy: 'vasyaId', createdAt: dateNow }
  },
  {
    id: '12',
    name: 'sloika',
    price: 15,
    description: '',
    img: '',
    type: '',
    isAvailable: false,
    create: { createdBy: undefined, createdAt: dateNow }
  }
];
jest.mock('../../models', () => ({
  products: {
    insertMany: jest.fn(),
    findMany: jest.fn(() => dbProducts)
  }
}));

describe('Service.addProducts', () => {
  beforeEach(() => {
    jest.resetModules();
    global.Date.now = jest.fn(() => dateNow);
  });
  test('when called with products and userId should add product with createInfo and return with id', async () => {
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
    const result = await services.products.addProducts(products, 'vasyaId');
    expect(db.products.insertMany).toHaveBeenCalledWith(products, 'vasyaId');
    expect(db.products.findMany).toHaveBeenCalled();
    expect(result).toEqual([dbProducts[0]]);
  });
  test('when called with products and without userId should add product with createInfo with time and return with id', async () => {
    const products: Omit<Product, 'id'>[] = [
      {
        id: '12',
        name: 'sloika',
        price: 15,
        description: '',
        img: '',
        type: '',
        isAvailable: false
      }
    ];
    // @ts-ignore
    const result = await services.products.addProducts(products);
    expect(db.products.insertMany).toHaveBeenCalledWith(products, undefined);
    expect(db.products.findMany).toHaveBeenCalled();
    expect(result).toEqual([dbProducts[1]]);
  });
});
