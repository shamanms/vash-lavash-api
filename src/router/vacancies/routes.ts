import {
  VacanciesGet,
  VacanciesPost,
  VacanciesPut,
  VacancyCountPut
} from './types';
import services from '../../services';

export const vacanciesGet: VacanciesGet = async (req, res, next) => {
  try {
    // Proceed without filtering if flag not passed
    const { isAvailable } = req.query;
    const vacancies = await services.vacancies.getVacancies({
      isAvailable: isAvailable ? isAvailable === 'true' : isAvailable
    });

    res.json(vacancies);
  } catch (e) {
    next(e);
  }
};
export const vacanciesPut: VacanciesPut = async (req, res, next) => {
  try {
    const result = await services.vacancies.updateVacancies(req.body);

    res.json(result);
  } catch (e) {
    next(e);
  }
};

export const vacanciesPost: VacanciesPost = async (req, res, next) => {
  try {
    await services.vacancies.addVacancies(req.body);

    res.json({ status: 'OK' });
  } catch (e) {
    next(e);
  }
};

export const vacancyCountPut: VacancyCountPut = async (req, res, next) => {
  try {
    await services.vacancies.addCountVacancy(req.params?.id);

    res.json({ status: 'New view' });
  } catch (e) {
    next(e);
  }
};
