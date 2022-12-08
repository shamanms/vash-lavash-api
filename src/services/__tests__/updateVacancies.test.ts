import db from '../../models';
import services from '../index';

jest.mock('../../models', () => ({
  vacancies: {
    updateOne: jest.fn()
  }
}));
const vacancies = {
  '1': {
    description: '',
    isAvailable: false
  },
  '2': {
    description: '',
    isAvailable: false
  }
};
jest.spyOn(console, 'log').mockImplementation();

describe('Service.updateVacancies', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('when both elements updated with userId, returns both IDs true', async () => {
    // @ts-ignore for test purposes
    db.vacancies.updateOne.mockImplementation((id) => id);
    const result = await services.vacancies.updateVacancies(
      vacancies,
      'vasyaId'
    );
    Object.entries(vacancies)
      .filter(([, value]) => typeof value !== 'object')
      .forEach(([id, vacancy], index) => {
        expect(db.vacancies.updateOne).toHaveBeenNthCalledWith(
          index + 1,
          id,
          vacancy
        );
      });
    const expectedResult = {
      '1': true,
      '2': true
    };
    expect(result).toEqual(expectedResult);
  });
  test('when one element failed, returns true and false', async () => {
    db.vacancies.updateOne
      // @ts-ignore for test purposes
      .mockReturnValueOnce('1')
      .mockReturnValueOnce(new Error());
    const result = await services.vacancies.updateVacancies(vacancies);
    const expectedResult = {
      '1': true,
      '2': false
    };
    expect(result).toEqual(expectedResult);
  });
  test('when both failed, returns both false', async () => {
    db.vacancies.updateOne
      // @ts-ignore for test purposes
      .mockReturnValueOnce(new Error())
      .mockReturnValueOnce(new Error());
    const result = await services.vacancies.updateVacancies(vacancies);
    const expectedResult = {
      '1': false,
      '2': false
    };
    expect(result).toEqual(expectedResult);
  });
});
