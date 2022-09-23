import { ValidationError } from '../../models/errors';
import { VacanciesGet, VacanciesPost, VacanciesPut } from './types';

export const vacanciesGet: VacanciesGet = function (req, res, next) {
  const { isAvailable } = req.query;

  if ('isAvailable' in req.query && !['true', 'false'].includes(isAvailable)) {
    throw new ValidationError('Invalid parameter');
  }

  next();
};

export const vacanciesPut: VacanciesPut = function (req, res, next) {
  const vacancies = req.body;

  if (
    typeof vacancies !== 'object' ||
    Array.isArray(vacancies) ||
    vacancies === null
  ) {
    throw new ValidationError('Invalid request');
  }

  if (Object.keys(vacancies).length < 1) {
    throw new ValidationError('Vacancy not passed');
  }

  Object.values(vacancies).forEach((vacancy) => {
    if (
      typeof vacancy !== 'object' ||
      vacancy === null ||
      Array.isArray(vacancy)
    ) {
      throw new ValidationError('Incorrect vacancies');
    }
  });

  next();
};

export const vacanciesPost: VacanciesPost = function (req, res, next) {
  const vacancy = req.body;

  if (
    typeof vacancy !== 'object' ||
    Array.isArray(vacancy) ||
    vacancy === null
  ) {
    throw new ValidationError('Invalid request');
  }

  if (Object.keys(vacancy).length < 1) {
    throw new ValidationError('Incorrect vacancy');
  }

  const requiredKeys: { [key: string]: string } = {
    position: 'string',
    requirements: 'string',
    salary: 'string',
    description: 'string',
    isAvailable: 'boolean'
  };

  Object.keys(vacancy).forEach((key) => {
    if (!(typeof vacancy[key] === requiredKeys[key])) {
      throw new ValidationError('Incorrect shape vacancy');
    }
  });

  next();
};
