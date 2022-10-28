import db from '../../models';
import services from '../index';

jest.mock('../../models', () => ({
  vacancies: {
    insertOne: jest.fn()
  }
}));

describe('Service.addVacancies', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  test('when called with vacancies = {} call db with vacancies', async () => {
    const vacancy = {};
    // @ts-ignore for test purposes
    await services.vacancies.addVacancies(vacancy);
    expect(db.vacancies.insertOne).toHaveBeenCalledWith(vacancy);
  });

  test('when called with vacancies = string call db with string', async () => {
    // @ts-ignore for test purposes
    await services.vacancies.addVacancies(['string']);
    expect(db.vacancies.insertOne).toHaveBeenCalledWith(['string']);
  });

  test('when called with vacancies = null call db with null', async () => {
    // @ts-ignore for test purposes
    await services.vacancies.addVacancies([null]);
    expect(db.vacancies.insertOne).toHaveBeenCalledWith([null]);
  });
});
