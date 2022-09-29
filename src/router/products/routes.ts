import services from '../../services';
import { ProductsGet, ProductsPost, ProductsPut } from './types';

export const productsGet: ProductsGet = async (req, res, next) => {
  try {
    // Proceed without filtering if flag not passed
    const { isAvailable } = req.query;
    const products = await services.products.getProducts({
      isAvailable: isAvailable ? isAvailable === 'true' : isAvailable
    });

    res.json({ getProducts: products });
  } catch (e) {
    next(e);
  }
};

export const productsPut: ProductsPut = async (req, res, next) => {
  try {
    const result = await services.products.updateProducts(req.body);

    res.json({ updateProducts: result });
  } catch (e) {
    next(e);
  }
};

export const productsPost: ProductsPost = async (req, res, next) => {
  try {
    await services.products.addProducts(req.body);

    res.json({ status: 'OK' });
  } catch (e) {
    next(e);
  }
};
