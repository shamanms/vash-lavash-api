import services from '../../services';
import {
  ProductGoogleImageUrlGet,
  ProductsGet,
  ProductsPost,
  ProductsPut,
  ProductsTypesGet
} from './types';
import { generateUploadSignedUrl } from '../../services/imageUploaderProducts';

export const productsGet: ProductsGet = async (req, res, next) => {
  try {
    // Proceed without filtering if flag not passed
    const { isAvailable } = req.query;
    const products = await services.products.getProducts({
      isAvailable: isAvailable ? isAvailable === 'true' : isAvailable
    });

    res.json(products);
  } catch (e) {
    next(e);
  }
};

export const productsPut: ProductsPut = async (req, res, next) => {
  try {
    const result = await services.products.updateProducts(req.body);

    res.json(result);
  } catch (e) {
    next(e);
  }
};

export const productsPost: ProductsPost = async (req, res, next) => {
  try {
    const products = await services.products.addProducts(req.body);

    res.json(products);
  } catch (e) {
    next(e);
  }
};

export const productGoogleImageUrlGet: ProductGoogleImageUrlGet = async (
  req,
  res,
  next
) => {
  try {
    const productId = req.params?.id;
    const fileExtension = req.query?.fileExtension;
    const url = await generateUploadSignedUrl({ productId, fileExtension });

    res.json({ url });
  } catch (e) {
    next(e);
  }
};

export const productsTypeGet: ProductsTypesGet = async (req, res, next) => {
  try {
    const products = await services.products.getProductsTypes();

    res.json(products);
  } catch (e) {
    next(e);
  }
};
