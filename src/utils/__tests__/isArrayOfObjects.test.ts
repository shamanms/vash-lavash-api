import { isArrayOfObjects } from '../index';

describe('utils isArrayOfObjects', () => {
  test('when variable is string should return false', () => {
    const variable = 'any';
    const result = isArrayOfObjects(variable);
    expect(result).toEqual(false);
  });
  test('when variable is array but value is not object should return false', () => {
    const variable = ['any'];
    const result = isArrayOfObjects(variable);
    expect(result).toEqual(false);
  });
  test('when variable is null should return false', () => {
    const variable = null;
    const result = isArrayOfObjects(variable);
    expect(result).toEqual(false);
  });
  test('when variable is boolean should return false', () => {
    const variable = true;
    const result = isArrayOfObjects(variable);
    expect(result).toEqual(false);
  });
  test('when variable is undefined should return false', () => {
    const variable = undefined;
    const result = isArrayOfObjects(variable);
    expect(result).toEqual(false);
  });
  test('when variable is number should return false', () => {
    const variable = 123;
    const result = isArrayOfObjects(variable);
    expect(result).toEqual(false);
  });
  test('when variable is object should return false', () => {
    const variable = {};
    const result = isArrayOfObjects(variable);
    expect(result).toEqual(false);
  });
  test('when variable is array and value is object should return true', () => {
    const variable = [{}];
    const result = isArrayOfObjects(variable);
    expect(result).toEqual(true);
  });
});
