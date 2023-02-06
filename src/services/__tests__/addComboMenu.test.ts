import db from '../../models';
import services from '../index';
import { ComboMenuModel } from '../../types';

const dateNow = Date.now();

const dbComboMenus = [
  {
    id: '1',
    name: 'obed',
    steps: { step: 1, products: ['id1', 'id2'] },
    isAvailable: false,
    create: { createdBy: 'vasyaId', createdAt: dateNow }
  },
  {
    id: '2',
    name: 'pizza',
    steps: { step: 1, products: ['id1', 'id2'] },
    isAvailable: false,
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
      steps: { step: 1, products: ['id1', 'id2'] },
      isAvailable: false
    };
    // @ts-ignore for test purposes
    const result = await services.comboMenus.addComboMenu(comboMenu, 'vasyaId');
    expect(db.comboMenus.insertOne).toHaveBeenCalledWith(comboMenu, 'vasyaId');
    expect(db.comboMenus.findMany).toHaveBeenCalled();
    expect(result).toEqual(dbComboMenus[0]);
  });
  test('when called with comboMenu, and without userId should add comboMenu with createInfo with time and return with id', async () => {
    const comboMenu: Omit<ComboMenuModel, 'id'> = {
      name: 'pizza',
      steps: { step: 1, products: ['id1', 'id2'] },
      isAvailable: false
    };

    // @ts-ignore for test purposes
    const result = await services.comboMenus.addComboMenu(comboMenu);
    expect(db.comboMenus.insertOne).toHaveBeenCalledWith(comboMenu, undefined);
    expect(db.comboMenus.findMany).toHaveBeenCalled();
    expect(result).toEqual(dbComboMenus[1]);
  });
});
