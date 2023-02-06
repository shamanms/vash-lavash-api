import db from '../../models';
import services from '../index';

jest.mock('../../models', () => ({
  comboMenus: {
    updateOne: jest.fn()
  }
}));
const comboMenus = {
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

describe('Service.updateComboMenus', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('when both elements updated with userId, returns both IDs true', async () => {
    // @ts-ignore for test purposes
    db.comboMenus.updateOne.mockImplementation((id) => id);
    const result = await services.comboMenus.updateComboMenus(
      comboMenus,
      'vasyaId'
    );
    Object.entries(comboMenus)
      .filter(([, value]) => typeof value !== 'object')
      .forEach(([id, comboMenu], index) => {
        expect(db.comboMenus.updateOne).toHaveBeenNthCalledWith(
          index + 1,
          id,
          comboMenu
        );
      });
    const expectedResult = {
      '1': true,
      '2': true
    };
    expect(result).toEqual(expectedResult);
  });
  test('when one element failed, returns true and false', async () => {
    db.comboMenus.updateOne
      // @ts-ignore for test purposes
      .mockReturnValueOnce('1')
      .mockReturnValueOnce(new Error());
    const result = await services.comboMenus.updateComboMenus(comboMenus);
    const expectedResult = {
      '1': true,
      '2': false
    };
    expect(result).toEqual(expectedResult);
  });
  test('when both failed, returns both false', async () => {
    db.comboMenus.updateOne
      // @ts-ignore for test purposes
      .mockReturnValueOnce(new Error())
      .mockReturnValueOnce(new Error());
    const result = await services.comboMenus.updateComboMenus(comboMenus);
    const expectedResult = {
      '1': false,
      '2': false
    };
    expect(result).toEqual(expectedResult);
  });
});
