import services from '../../services';
import { SalesGet, SalesGoogleImageUrlGet, SalesPost, SalesPut } from './types';
import { generateUploadSignedUrl } from '../../services/imageUploader';

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
    await services.sales.addSales(req.body);

    res.json({ status: 'OK' });
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
    const saleId = req.params?.id;
    const fileExtension = req.query?.fileExtension;
    const url = await generateUploadSignedUrl({
      itemId: saleId,
      fileExtension
    });

    res.json({ url });
  } catch (e) {
    next(e);
  }
};
