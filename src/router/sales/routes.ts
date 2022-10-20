import services from '../../services';
import { SalesGet, SalesGoogleImageUrlGet, SalesPost, SalesPut } from './types';
import { generateUploadSignedUrl } from '../../services/imageUploaderSales';

export const salesGet: SalesGet = async (req, res, next) => {
  try {
    // Proceed without filtering if flag not passed
    const { isAvailable } = req.query;
    const sales = await services.sales.getSales({
      isAvailable: isAvailable ? isAvailable === 'true' : isAvailable
    });

    res.json(sales);
  } catch (e) {
    next(e);
  }
};

export const salesPut: SalesPut = async (req, res, next) => {
  try {
    const result = await services.sales.updateSales(req.body);

    res.json(result);
  } catch (e) {
    next(e);
  }
};

export const salesPost: SalesPost = async (req, res, next) => {
  try {
    const sales = await services.sales.addSales(req.body);

    res.json(sales);
  } catch (e) {
    next(e);
  }
};

export const salesGoogleImageUrlGet: SalesGoogleImageUrlGet = async (
  req,
  res,
  next
) => {
  try {
    const salesId = req.params?.id;
    const fileExtension = req.query?.fileExtension;
    const url = await generateUploadSignedUrl({ salesId, fileExtension });

    res.json({ url });
  } catch (e) {
    next(e);
  }
};
