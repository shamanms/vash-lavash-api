import { AdditivesModel, dbQuery } from '../types';
import { Model } from '../models';

export class AdditivesService {
  constructor(private readonly additivesModel: Model<AdditivesModel>) {}

  public async getAdditives({ isAvailable }: { isAvailable?: boolean }) {
    let query;

    if (typeof isAvailable === 'boolean') {
      query = ['isAvailable', '==', isAvailable] as dbQuery;
    }

    return this.additivesModel.findMany(query);
  }

  public async addAdditive(additive: AdditivesModel) {
    await this.additivesModel.insertOne(additive);
    const existingAdditive = await this.getAdditives({});
    return existingAdditive.find((dbAdditive) =>
      Object.entries(additive).every(
        ([key, value]) => dbAdditive[key] === value
      )
    );
  }

  public async updateAdditives(additives: {
    [key: string]: Partial<AdditivesModel>;
  }) {
    let updatedAdditives = Object.entries(additives).map(([id, additive]) =>
      this.additivesModel.updateOne(id, additive)
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
