import { LabelsModel } from '../types';
import { Model } from '../models';

export class LabelsService {
  constructor(private readonly labelsModel: Model<LabelsModel>) {}

  public async getLabels() {
    return this.labelsModel.findMany();
  }

  public async addLabel(label: LabelsModel, userId?: string) {
    await this.labelsModel.insertOne(label, userId);
    const existingLabel = await this.getLabels();
    return existingLabel.find((dbLabel) =>
      Object.entries(label)
        .filter(([, value]) => typeof value !== 'object')
        .every(([key, value]) => dbLabel[key] === value)
    );
  }

  public async updateLabels(
    labels: { [key: string]: Partial<LabelsModel> },
    userId?: string
  ) {
    let updatedLabels = Object.entries(labels).map(([id, label]) =>
      this.labelsModel.updateOne(id, label, userId)
    );
    const updatingResult = await Promise.allSettled(updatedLabels);
    return Object.keys(labels).reduce((acc, id) => {
      const dbResult = updatingResult.find(
        (updateResult) =>
          updateResult.status === 'fulfilled' && updateResult.value === id
      );
      console.log(
        'LabelsService.updateLabels:: updating result:',
        updatingResult
      );
      return {
        ...acc,
        [id]: typeof dbResult === 'object'
      };
    }, {});
  }
}
