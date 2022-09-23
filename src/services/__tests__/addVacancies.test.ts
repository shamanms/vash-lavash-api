import db from '../../models';
import { VacancyModel } from '../../types';
import services from '../index';

jest.mock('../../models', () => ({
  vacancies: {
    insertMany: jest.fn()
  }
}));

describe('Service.addVacancies', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  test('when called with vacancies = [] call db with vacancies', async () => {
    const vacancies: VacancyModel[] = [];
    await services.vacancies.addVacancies(vacancies);
    expect(db.vacancies.insertMany).toHaveBeenCalledWith(vacancies);
  });

  test('when called with vacancies = string call db with string', async () => {
    // @ts-ignore for test purposes
    await services.vacancies.addVacancies(['string']);
    expect(db.vacancies.insertMany).toHaveBeenCalledWith(['string']);
  });

  test('when called with products = null call db with null', async () => {
    // @ts-ignore for test purposes
    await services.vacancies.addVacancies([null]);
    expect(db.vacancies.insertMany).toHaveBeenCalledWith([null]);
  });
});
