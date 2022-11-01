import db from '../../models';
import services from '../index';
import { AdditiveModel } from '../../types';

const dbAdditive = {
  id: '1',
  name: 'perec',
  price: 1,
  img: '',
  isAvailable: false
};
jest.mock('../../models', () => ({
  additives: {
    insertOne: jest.fn(),
    findMany: jest.fn(() => [dbAdditive])
  }
}));

describe('Service.addAdditives', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  test('when called with additive should add additive and return with id', async () => {
    const additive: Omit<AdditiveModel, 'id'> = {
      name: 'perec',
      price: 1,
      img: '',
      isAvailable: false
    };
    // @ts-ignore for test purposes
    const result = await services.additives.addAdditive(additive);
    expect(db.additives.insertOne).toHaveBeenCalledWith(additive);
    expect(db.additives.findMany).toHaveBeenCalled();
    expect(result).toEqual(dbAdditive);
  });
});
