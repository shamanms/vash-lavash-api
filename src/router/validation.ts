import { Product, TypedRequestBody, TypedRequestQuery } from '../types';

export const validateProductsPut = function (
  req: TypedRequestBody<Product[]>,
  res: any
) {
  const products = req.body;
  if (!Array.isArray(products)) return res.status(400).send('Invalid request');
  const isProductsValid = products.every((product) => {
    return (
      typeof product === 'object' &&
      product !== null &&
      !Array.isArray(product) &&
      typeof product?.id === 'string'
    );
  });
  if (!isProductsValid) return res.status(400).send('Invalid product');
};

export const validateProductsGet = function (
  req: TypedRequestQuery<{ isAvailable: 'true' | 'false' }>,
  res: any
) {
  const { isAvailable } = req.query;
  if ('isAvailable' in req.query && !['true', 'false'].includes(isAvailable)) {
    return res.status(400).send('Invalid parameter');
  }
};
