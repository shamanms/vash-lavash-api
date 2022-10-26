import db from '../../models';
import services from '../index';

jest.mock('../../models', () => ({
  additives: {
    updateOne: jest.fn()
  }
}));
const additives = {
  '1': {
    name: '',
    isAvailable: false
  },
  '2': {
    name: '',
    isAvailable: false
  }
};
jest.spyOn(console, 'log').mockImplementation();

describe('Service.updateAdditives', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('when both elements updated, returns both IDs true', async () => {
    // @ts-ignore for test purposes
    db.additives.updateOne.mockImplementation((id) => id);
    const result = await services.additives.updateAdditives(additives);
    Object.entries(additives).forEach(([id, additive], index) => {
      expect(db.additives.updateOne).toHaveBeenNthCalledWith(
        index + 1,
        id,
        additive
      );
    });
    const expectedResult = {
      '1': true,
      '2': true
    };
    expect(result).toEqual(expectedResult);
  });
  test('when one element failed, returns true and false', async () => {
    db.additives.updateOne
      // @ts-ignore for test purposes
      .mockReturnValueOnce('1')
      .mockReturnValueOnce(new Error());
    const result = await services.additives.updateAdditives(additives);
    const expectedResult = {
      '1': true,
      '2': false
    };
    expect(result).toEqual(expectedResult);
  });
  test('when both failed, returns both false', async () => {
    db.additives.updateOne
      // @ts-ignore for test purposes
      .mockReturnValueOnce(new Error())
      .mockReturnValueOnce(new Error());
    const result = await services.additives.updateAdditives(additives);
    const expectedResult = {
      '1': false,
      '2': false
    };
    expect(result).toEqual(expectedResult);
  });
});
