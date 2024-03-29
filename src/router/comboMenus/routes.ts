import {
  ComboMenuGoogleImageUrlGet,
  ComboMenusGet,
  ComboMenusPost,
  ComboMenusPut
} from './types';
import services from '../../services';
import { generateUploadSignedUrl } from '../../services/imageUploader';

export const comboMenusGet: ComboMenusGet = async (req, res, next) => {
  try {
    // Proceed without filtering if flag not passed
    const { isAvailable } = req.query;
    const comboMenus = await services.comboMenus.getComboMenus({
      isAvailable: isAvailable ? isAvailable === 'true' : isAvailable
    });

    res.json(comboMenus);
  } catch (e) {
    next(e);
  }
};
export const comboMenusPut: ComboMenusPut = async (req, res, next) => {
  try {
    const result = await services.comboMenus.updateComboMenus(
      req.body,
      req.user.id
    );

    res.json(result);
  } catch (e) {
    next(e);
  }
};

export const comboMenusPost: ComboMenusPost = async (req, res, next) => {
  try {
    const comboMenu = await services.comboMenus.addComboMenu(
      req.body,
      req.user.id
    );

    res.json(comboMenu);
  } catch (e) {
    next(e);
  }
};

export const comboMenuGoogleImageUrlGet: ComboMenuGoogleImageUrlGet = async (
  req,
  res,
  next
) => {
  try {
    const comboMenuId = req.params?.id;
    const fileExtension = req.query?.fileExtension;
    const url = await generateUploadSignedUrl({
      itemId: comboMenuId,
      fileExtension
    });

    res.json({ url });
  } catch (e) {
    next(e);
  }
};
