import db from '../../models';
import services from '../index';

jest.mock('../../models', () => ({
  vacancies: {
    findOneById: jest.fn(),
    updateOne: jest.fn()
  }
}));
describe('service.addCountVacancy', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  test('when called with correct vacancyId should add one on counter', async () => {
    // @ts-ignore for test purposes
    db.vacancies.findOneById.mockImplementation(() => ({
      id: 'bb',
      counter: 0
    }));
    await services.vacancies.addCountVacancy('bb');

    expect(db.vacancies.findOneById).toHaveBeenCalledWith('bb');
    expect(db.vacancies.updateOne).toHaveBeenCalledWith('bb', { counter: 1 });
  });
  test('when called with invalid vacancyId should return', async () => {
    // @ts-ignore for test purposes
    db.vacancies.findOneById.mockImplementation(() => undefined);
    try {
      await services.vacancies.addCountVacancy('bb');
    } catch (e: any) {
      expect(e?.message).toMatch('Vacancy with id: bb not found');
      expect(db.vacancies.updateOne).not.toHaveBeenCalled();
    }
  });
});
