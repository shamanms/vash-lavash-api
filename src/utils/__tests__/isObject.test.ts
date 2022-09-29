import { isObject } from '../index';

describe('utils isObject', () => {
  test('when variable is string should return false', () => {
    const variable = 'any';
    const result = isObject(variable);
    expect(result).toEqual(false);
  });
  test('when variable is array should return false', () => {
    const variable = ['any'];
    const result = isObject(variable);
    expect(result).toEqual(false);
  });
  test('when variable is null should return false', () => {
    const variable = null;
    const result = isObject(variable);
    expect(result).toEqual(false);
  });
  test('when variable is boolean should return false', () => {
    const variable = true;
    const result = isObject(variable);
    expect(result).toEqual(false);
  });
  test('when variable is undefined should return false', () => {
    const variable = undefined;
    const result = isObject(variable);
    expect(result).toEqual(false);
  });
  test('when variable is number should return false', () => {
    const variable = 123;
    const result = isObject(variable);
    expect(result).toEqual(false);
  });
  test('when variable is object should return true', () => {
    const variable = {};
    const result = isObject(variable);
    expect(result).toEqual(true);
  });
});
