import { AdditiveModel, dbQuery } from '../types';
import { Model } from '../models';

export class AdditivesService {
  constructor(private readonly additivesModel: Model<AdditiveModel>) {}

  public async getAdditives({ isAvailable }: { isAvailable?: boolean }) {
    let query;

    if (typeof isAvailable === 'boolean') {
      query = ['isAvailable', '==', isAvailable] as dbQuery;
    }

    return this.additivesModel.findMany(query);
  }

  public async addAdditive(additive: AdditiveModel, userId?: string) {
    await this.additivesModel.insertOne(additive, userId);
    const existingAdditive = await this.getAdditives({});
    return existingAdditive.find((dbAdditive) =>
      Object.entries(additive)
        .filter(([, value]) => typeof value !== 'object')
        .every(([key, value]) => dbAdditive[key] === value)
    );
  }

  public async updateAdditives(
    additives: {
      [key: string]: Partial<AdditiveModel>;
    },
    userId?: string
  ) {
    let updatedAdditives = Object.entries(additives).map(([id, additive]) =>
      this.additivesModel.updateOne(id, additive, userId)
    );
    const updatingResult = await Promise.allSettled(updatedAdditives);
    return Object.keys(additives).reduce((acc, id) => {
      const dbResult = updatingResult.find(
        (updateResult) =>
          updateResult.status === 'fulfilled' && updateResult.value === id
      );
      console.log(
        'AdditivesService.updateAdditives:: updating result:',
        updatingResult
      );
      return {
        ...acc,
        [id]: typeof dbResult === 'object'
      };
    }, {});
  }
}
