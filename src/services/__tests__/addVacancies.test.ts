import db from '../../models';
import services from '../index';
import { VacancyModel } from '../../types';

const dbVacancy = {
  id: '1',
  position: 'povar',
  requirements: 'vkesno gotov',
  salary: '100',
  description: 'bludo',
  isAvailable: false,
  counter: 0
};
jest.mock('../../models', () => ({
  vacancies: {
    insertOne: jest.fn(),
    findMany: jest.fn(() => [dbVacancy])
  }
}));

describe('Service.addVacancies', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  test('when called with vacancy should add vacancy and return with id', async () => {
    const vacancy: Omit<VacancyModel, 'id'> = {
      position: 'povar',
      requirements: 'vkesno gotov',
      salary: '100',
      description: 'bludo',
      isAvailable: false,
      counter: 0
    };
    // @ts-ignore for test purposes
    const result = await services.vacancies.addVacancy(vacancy);
    expect(db.vacancies.insertOne).toHaveBeenCalledWith(vacancy);
    expect(db.vacancies.findMany).toHaveBeenCalled();
    expect(result).toEqual(dbVacancy);
  });
});
