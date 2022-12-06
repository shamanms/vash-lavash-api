import db from '../../models';
import services from '../index';
import { VacancyModel } from '../../types';

const dateNow = Date.now();

const dbVacancies = [
  {
    id: '1',
    position: 'povar',
    requirements: 'vkysno gotov',
    salary: '100',
    description: 'bludo',
    isAvailable: false,
    counter: 0,
    create: { createdBy: 'vasyaId', createdAt: dateNow }
  },
  {
    id: '2',
    position: 'admin',
    requirements: 'mozg',
    salary: '10000',
    description: 'personal',
    isAvailable: false,
    counter: 0,
    create: { createdBy: undefined, createdAt: dateNow }
  }
];
jest.mock('../../models', () => ({
  vacancies: {
    insertOne: jest.fn(),
    findMany: jest.fn(() => dbVacancies)
  }
}));

describe('Service.addVacancies', () => {
  beforeEach(() => {
    jest.resetModules();
    global.Date.now = jest.fn(() => dateNow);
  });
  test('when called with vacancy and userId should add vacancy with createInfo and return with id', async () => {
    const vacancy: Omit<VacancyModel, 'id'> = {
      position: 'povar',
      requirements: 'vkysno gotov',
      salary: '100',
      description: 'bludo',
      isAvailable: false,
      counter: 0
    };
    // @ts-ignore for test purposes
    const result = await services.vacancies.addVacancy(vacancy, 'vasyaId');
    expect(db.vacancies.insertOne).toHaveBeenCalledWith(vacancy, 'vasyaId');
    expect(db.vacancies.findMany).toHaveBeenCalled();
    expect(result).toEqual(dbVacancies[0]);
  });
  test('when called with vacancy and without userId should add vacancy with createInfo with time and return with id', async () => {
    const vacancy: Omit<VacancyModel, 'id'> = {
      id: '2',
      position: 'admin',
      requirements: 'mozg',
      salary: '10000',
      description: 'personal',
      isAvailable: false,
      counter: 0
    };
    // @ts-ignore for test purposes
    const result = await services.vacancies.addVacancy(vacancy);
    expect(db.vacancies.insertOne).toHaveBeenCalledWith(vacancy, undefined);
    expect(db.vacancies.findMany).toHaveBeenCalled();
    expect(result).toEqual(dbVacancies[1]);
  });
});
