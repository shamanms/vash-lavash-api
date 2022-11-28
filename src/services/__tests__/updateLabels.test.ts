import db from '../../models';
import services from '../index';

jest.mock('../../models', () => ({
  labels: {
    updateOne: jest.fn()
  }
}));
const labels = {
  '1': {
    name: '',
    color: ''
  },
  '2': {
    name: '',
    color: ''
  }
};
jest.spyOn(console, 'log').mockImplementation();

describe('Service.updateLabels', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('when both elements updated, returns both IDs true', async () => {
    // @ts-ignore for test purposes
    db.labels.updateOne.mockImplementation((id) => id);
    const result = await services.labels.updateLabels(labels);
    Object.entries(labels).forEach(([id, label], index) => {
      expect(db.labels.updateOne).toHaveBeenNthCalledWith(index + 1, id, label);
    });
    const expectedResult = {
      '1': true,
      '2': true
    };
    expect(result).toEqual(expectedResult);
  });
  test('when one element failed, returns true and false', async () => {
    db.labels.updateOne
      // @ts-ignore for test purposes
      .mockReturnValueOnce('1')
      .mockReturnValueOnce(new Error());
    const result = await services.labels.updateLabels(labels);
    const expectedResult = {
      '1': true,
      '2': false
    };
    expect(result).toEqual(expectedResult);
  });
  test('when both failed, returns both false', async () => {
    db.labels.updateOne
      // @ts-ignore for test purposes
      .mockReturnValueOnce(new Error())
      .mockReturnValueOnce(new Error());
    const result = await services.labels.updateLabels(labels);
    const expectedResult = {
      '1': false,
      '2': false
    };
    expect(result).toEqual(expectedResult);
  });
});
