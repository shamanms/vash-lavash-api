import db from '../../models';
import services from '../index';
import { AdditiveModel } from '../../types';

const dateNow = Date.now();

const dbAdditives = [
  {
    id: '1',
    name: 'perec',
    price: 1,
    img: '',
    isAvailable: false,
    create: { createdBy: 'vasyaId', createdAt: dateNow }
  },
  {
    id: '2',
    name: 'sol',
    price: 1,
    img: '',
    isAvailable: false,
    create: { createdBy: undefined, createdAt: dateNow }
  }
];
jest.mock('../../models', () => ({
  additives: {
    insertOne: jest.fn(),
    findMany: jest.fn(() => dbAdditives)
  }
}));

describe('Service.addAdditives', () => {
  beforeEach(() => {
    jest.resetModules();
    global.Date.now = jest.fn(() => dateNow);
  });
  test('when called with additive, and userId should add additive with createInfo and return with id', async () => {
    const additive: Omit<AdditiveModel, 'id'> = {
      name: 'perec',
      price: 1,
      img: '',
      isAvailable: false
    };
    // @ts-ignore for test purposes
    const result = await services.additives.addAdditive(additive, 'vasyaId');
    expect(db.additives.insertOne).toHaveBeenCalledWith(additive, 'vasyaId');
    expect(db.additives.findMany).toHaveBeenCalled();
    expect(result).toEqual(dbAdditives[0]);
  });
  test('when called with additive, and without userId should add additive with createInfo with time and return with id', async () => {
    const additive: Omit<AdditiveModel, 'id'> = {
      name: 'sol',
      price: 1,
      img: '',
      isAvailable: false
    };

    // @ts-ignore for test purposes
    const result = await services.additives.addAdditive(additive);
    expect(db.additives.insertOne).toHaveBeenCalledWith(additive, undefined);
    expect(db.additives.findMany).toHaveBeenCalled();
    expect(result).toEqual(dbAdditives[1]);
  });
});
