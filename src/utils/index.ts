export const isObject = (variable: any): boolean => {
  return (
    typeof variable === 'object' &&
    variable !== null &&
    !Array.isArray(variable)
  );
};

export const isNotEmptyObject = (obj: any): boolean => {
  if (isObject(obj)) {
    return Object.keys(obj).length > 0;
  }
  return false;
};

export const isArrayOfObjects = (arr: any): boolean => {
  if (Array.isArray(arr)) {
    return Object.values(arr).every((elem) => isObject(elem));
  }
  return false;
};
