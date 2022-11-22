import db from '../../models';
import services from '../index';
import { LabelsModel } from '../../types';

const dbLabel = {
  id: '1',
  name: 'top',
  color: 'green'
};
jest.mock('../../models', () => ({
  labels: {
    insertOne: jest.fn(),
    findMany: jest.fn(() => [dbLabel])
  }
}));

describe('Service.addLabel', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  test('when called with label should add label and return with id', async () => {
    const label: Omit<LabelsModel, 'id'> = {
      name: 'top',
      color: 'green'
    };
    // @ts-ignore for test purposes
    const result = await services.labels.addLabel(label);
    expect(db.labels.insertOne).toHaveBeenCalledWith(label);
    expect(db.labels.findMany).toHaveBeenCalled();
    expect(result).toEqual(dbLabel);
  });
});
