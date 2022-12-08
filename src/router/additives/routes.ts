import {
  AdditivesGet,
  AdditivesPost,
  AdditivesPut,
  AdditiveGoogleImageUrlGet
} from './types';
import services from '../../services';
import { generateUploadSignedUrl } from '../../services/imageUploader';

export const additivesGet: AdditivesGet = async (req, res, next) => {
  try {
    // Proceed without filtering if flag not passed
    const { isAvailable } = req.query;
    const additives = await services.additives.getAdditives({
      isAvailable: isAvailable ? isAvailable === 'true' : isAvailable
    });

    res.json(additives);
  } catch (e) {
    next(e);
  }
};
export const additivesPut: AdditivesPut = async (req, res, next) => {
  try {
    const result = await services.additives.updateAdditives(
      req.body,
      req.user.id
    );

    res.json(result);
  } catch (e) {
    next(e);
  }
};

export const additiveGoogleImageUrlGet: AdditiveGoogleImageUrlGet = async (
  req,
  res,
  next
) => {
  try {
    const additiveId = req.params?.id;
    const fileExtension = req.query?.fileExtension;
    const url = await generateUploadSignedUrl({
      itemId: additiveId,
      fileExtension
    });

    res.json({ url });
  } catch (e) {
    next(e);
  }
};

export const additivesPost: AdditivesPost = async (req, res, next) => {
  try {
    const additive = await services.additives.addAdditive(
      req.body,
      req.user.id
    );

    res.json(additive);
  } catch (e) {
    next(e);
  }
};
