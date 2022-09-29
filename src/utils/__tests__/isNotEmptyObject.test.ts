import { isNotEmptyObject } from '../index';

describe('utils isNotEmptyObject', () => {
  test('when variable is string should return false', () => {
    const variable = 'any';
    const result = isNotEmptyObject(variable);
    expect(result).toEqual(false);
  });
  test('when variable is array should return false', () => {
    const variable = ['any'];
    const result = isNotEmptyObject(variable);
    expect(result).toEqual(false);
  });
  test('when variable is null should return false', () => {
    const variable = null;
    const result = isNotEmptyObject(variable);
    expect(result).toEqual(false);
  });
  test('when variable is boolean should return false', () => {
    const variable = true;
    const result = isNotEmptyObject(variable);
    expect(result).toEqual(false);
  });
  test('when variable is undefined should return false', () => {
    const variable = undefined;
    const result = isNotEmptyObject(variable);
    expect(result).toEqual(false);
  });
  test('when variable is number should return false', () => {
    const variable = 123;
    const result = isNotEmptyObject(variable);
    expect(result).toEqual(false);
  });
  test('when variable is empty object should return false', () => {
    const variable = {};
    const result = isNotEmptyObject(variable);
    expect(result).toEqual(false);
  });
  test('when variable is not empty object should return true', () => {
    const variable = {
      any: ''
    };
    const result = isNotEmptyObject(variable);
    expect(result).toEqual(true);
  });
});
