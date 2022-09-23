import { VacanciesGet, VacanciesPost, VacanciesPut } from './types';

export const vacanciesGet: VacanciesGet = async (req: any, res, next) => {
  try {
    res.json({ status: 'ok' });
  } catch (e) {
    next(e);
  }
};
export const vacanciesPut: VacanciesPut = async (req, res, next) => {
  try {
    res.json({ status: 'ok' });
  } catch (e) {
    next(e);
  }
};

export const vacanciesPost: VacanciesPost = async (req, res, next) => {
  try {
    res.json({ status: 'ok' });
  } catch (e) {
    next(e);
  }
};
