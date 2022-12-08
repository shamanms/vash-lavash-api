import db from '../../models';
import services from '../index';
import { LabelsModel } from '../../types';

const dateNow = Date.now();

const dbLabels = [
  {
    id: '1',
    name: 'top',
    color: 'green',
    create: { createdBy: 'vasyaId', createdAt: dateNow }
  },
  {
    id: '2',
    name: 'super',
    color: 'red',
    create: { createdBy: undefined, createdAt: dateNow }
  }
];
jest.mock('../../models', () => ({
  labels: {
    insertOne: jest.fn(),
    findMany: jest.fn(() => dbLabels)
  }
}));

describe('Service.addLabel', () => {
  beforeEach(() => {
    jest.resetModules();
    global.Date.now = jest.fn(() => dateNow);
  });
  test('when called with label and userId should add label with createInfo and return with id', async () => {
    const label: Omit<LabelsModel, 'id'> = {
      name: 'top',
      color: 'green'
    };
    // @ts-ignore for test purposes
    const result = await services.labels.addLabel(label, 'vasyaId');
    expect(db.labels.insertOne).toHaveBeenCalledWith(label, 'vasyaId');
    expect(db.labels.findMany).toHaveBeenCalled();
    expect(result).toEqual(dbLabels[0]);
  });
  test('when called with label and without userId should add label with createInfo with time and return with id', async () => {
    const label: Omit<LabelsModel, 'id'> = {
      name: 'super',
      color: 'red'
    };
    // @ts-ignore for test purposes
    const result = await services.labels.addLabel(label);
    expect(db.labels.insertOne).toHaveBeenCalledWith(label, undefined);
    expect(db.labels.findMany).toHaveBeenCalled();
    expect(result).toEqual(dbLabels[1]);
  });
});
