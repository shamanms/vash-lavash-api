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

  public async addVacancies(vacancies: VacancyModel) {
    return this.vacancyModel.insertOne(vacancies);
  }

  public async updateVacancies(vacancies: {
    [key: string]: Partial<VacancyModel>;
  }) {
    let updatedVacancies = Object.entries(vacancies).map(([id, product]) =>
      this.vacancyModel.updateOne(id, product)
    );
    const updatingResult = await Promise.allSettled(updatedVacancies);
    return Object.keys(vacancies).reduce((acc, id) => {
      const dbResult = updatingResult.find(
        (updateResult) =>
          updateResult.status === 'fulfilled' && updateResult.value === id
      );
      console.log(
        'VacancyService.VacancyService:: updating result:',
        updatingResult
      );
      return {
        ...acc,
        [id]: typeof dbResult === 'object'
      };
    }, {});
  }
}
