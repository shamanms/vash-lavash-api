import db from '../../models';
import services from '../index';
import { ComboMenuModel } from '../../types';

const dateNow = Date.now();

const dbComboMenus = [
  {
    id: '1',
    name: 'obed',
    steps: {
      stepName: 'one',
      multiProducts: false,
      multiOneProduct: false,
      maxProducts: null,
      products: ['id1', 'id2']
    },
    fixedPrice: true,
    isAvailable: false,
    isConstructor: false,
    create: { createdBy: 'vasyaId', createdAt: dateNow }
  },
  {
    id: '2',
    name: 'fast food',
    steps: {
      stepName: 'one',
      multiProducts: false,
      multiOneProduct: false,
      maxProducts: null,
      products: ['id1', 'id2']
    },
    isAvailable: false,
    fixedPrice: true,
    isConstructor: false,
    create: { createdBy: undefined, createdAt: dateNow }
  },
  {
    id: '3',
    name: 'pizza',
    steps: {
      stepName: 'one',
      multiProducts: true,
      multiOneProduct: true,
      maxProducts: null,
      products: ['id1', 'id2']
    },
    isAvailable: false,
    fixedPrice: false,
    isConstructor: true,
    create: { createdBy: undefined, createdAt: dateNow }
  }
];

jest.mock('../../models', () => ({
  comboMenus: {
    insertOne: jest.fn(),
    findMany: jest.fn(() => dbComboMenus)
  }
}));

describe('Service.addComboMenus', () => {
  beforeEach(() => {
    jest.resetModules();
    global.Date.now = jest.fn(() => dateNow);
  });
  test('when called with comboMenu, and userId should add comboMenu with createInfo and return with id', async () => {
    const comboMenu: Omit<ComboMenuModel, 'id'> = {
      name: 'obed',
      steps: {
        stepName: 'one',
        multiProducts: false,
        multiOneProduct: false,
        maxProducts: null,
        products: ['id1', 'id2']
      },
      fixedPrice: true,
      isAvailable: false,
      isConstructor: false
    };
    // @ts-ignore for test purposes
    const result = await services.comboMenus.addComboMenu(comboMenu, 'vasyaId');
    expect(db.comboMenus.insertOne).toHaveBeenCalledWith(comboMenu, 'vasyaId');
    expect(db.comboMenus.findMany).toHaveBeenCalled();
    expect(result).toEqual(dbComboMenus[0]);
  });
  test('when called with comboMenu, and without userId should add comboMenu with createInfo with time and return with id', async () => {
    const comboMenu: Omit<ComboMenuModel, 'id'> = {
      name: 'fast food',
      steps: {
        stepName: 'one',
        multiProducts: false,
        multiOneProduct: false,
        maxProducts: null,
        products: ['id1', 'id2']
      },
      isAvailable: false,
      fixedPrice: true,
      isConstructor: false
    };

    // @ts-ignore for test purposes
    const result = await services.comboMenus.addComboMenu(comboMenu);
    expect(db.comboMenus.insertOne).toHaveBeenCalledWith(comboMenu, undefined);
    expect(db.comboMenus.findMany).toHaveBeenCalled();
    expect(result).toEqual(dbComboMenus[1]);
  });
  test('when called with comboMenu, and without userId should add comboMenu with createInfo with time and return with id', async () => {
    const comboMenu: Omit<ComboMenuModel, 'id'> = {
      name: 'pizza',
      steps: {
        stepName: 'one',
        multiProducts: true,
        multiOneProduct: true,
        maxProducts: null,
        products: ['id1', 'id2']
      },
      isAvailable: false,
      fixedPrice: false,
      isConstructor: true
    };

    // @ts-ignore for test purposes
    const result = await services.comboMenus.addComboMenu(comboMenu);
    expect(db.comboMenus.insertOne).toHaveBeenCalledWith(comboMenu, undefined);
    expect(db.comboMenus.findMany).toHaveBeenCalled();
    expect(result).toEqual(dbComboMenus[2]);
  });
});
