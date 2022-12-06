import { Model } from '../models';
import { dbQuery, VacancyModel } from '../types';

export class VacancyService {
  constructor(private readonly vacancyModel: Model<VacancyModel>) {}

  public async getVacancies({ isAvailable }: { isAvailable?: boolean }) {
    let query;

    if (typeof isAvailable === 'boolean') {
      query = ['isAvailable', '==', isAvailable] as dbQuery;
    }

    return this.vacancyModel.findMany(query);
  }

  public async addVacancy(vacancy: VacancyModel, userId?: string) {
    await this.vacancyModel.insertOne(vacancy, userId);
    const existingVacancy = await this.getVacancies({});
    return existingVacancy.find((dbVacancy) =>
      Object.entries(vacancy)
        .filter(([, value]) => typeof value !== 'object')
        .every(([key, value]) => dbVacancy[key] === value)
    );
  }

  public async updateVacancies(
    vacancies: {
      [key: string]: Partial<VacancyModel>;
    },
    userId?: string
  ) {
    let updatedVacancies = Object.entries(vacancies).map(([id, vacancy]) =>
      this.vacancyModel.updateOne(id, vacancy, userId)
    );
    const updatingResult = await Promise.allSettled(updatedVacancies);
    return Object.keys(vacancies).reduce((acc, id) => {
      const dbResult = updatingResult.find(
        (updateResult) =>
          updateResult.status === 'fulfilled' && updateResult.value === id
      );
      console.log(
        'VacancyService.updateVacancies:: updating result:',
        updatingResult
      );
      return {
        ...acc,
        [id]: typeof dbResult === 'object'
      };
    }, {});
  }

  public async addCountVacancy(vacancyId: string) {
    const vacancy = await this.vacancyModel.findOneById(vacancyId);

    if (vacancy) {
      const counter = { counter: vacancy.counter + 1 };
      await this.vacancyModel.updateOne(vacancyId, counter);
    } else {
      throw new Error(`Vacancy with id: ${vacancyId} not found`);
    }
  }
}
