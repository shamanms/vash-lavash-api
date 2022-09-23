import db from '../../models';
import services from '../index';

jest.mock('../../models', () => ({
  vacancies: {
    findMany: jest.fn()
  }
}));

describe('Service.getVacancies', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('when called with empty object call db with undefined', async () => {
    await services.vacancies.getVacancies({});

    expect(db.vacancies.findMany).toHaveBeenCalledWith(undefined);
  });

  test('when called with isAvailable = true call db with query true', async () => {
    const isAvailable = true;
    await services.vacancies.getVacancies({ isAvailable });

    expect(db.vacancies.findMany).toHaveBeenCalledWith([
      'isAvailable',
      '==',
      isAvailable
    ]);
  });

  test('when called with isAvailable = false call db with query false', async () => {
    const isAvailable = false;
    await services.vacancies.getVacancies({ isAvailable });

    expect(db.vacancies.findMany).toHaveBeenCalledWith([
      'isAvailable',
      '==',
      isAvailable
    ]);
  });

  test('when called with isAvailable = null call db with undefined', async () => {
    const isAvailable = null;
    // @ts-ignore for test purposes
    await services.vacancies.getVacancies({ isAvailable });

    expect(db.vacancies.findMany).toHaveBeenCalledWith(undefined);
  });

  test('when called with isAvailable = "true" call db with undefined', async () => {
    const isAvailable = 'true';
    // @ts-ignore for test purposes
    await services.vacancies.getVacancies({ isAvailable });

    expect(db.vacancies.findMany).toHaveBeenCalledWith(undefined);
  });
});
