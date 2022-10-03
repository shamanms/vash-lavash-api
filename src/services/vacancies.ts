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
    let updatedVacancies = Object.entries(vacancies).map(([id, vacancy]) =>
      this.vacancyModel.updateOne(id, vacancy)
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
      throw new Error(`Product with id: ${vacancyId} not found`);
    }
  }
}
