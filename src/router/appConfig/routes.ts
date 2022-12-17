import { AppConfigGet, SetIsOrderingAvailablePut } from './types';
import services from '../../services';

export const appConfigGet: AppConfigGet = async (req, res, next) => {
  try {
    const appConfig = await services.appConfig.getAppConfig();
    res.json(appConfig);
  } catch (e) {
    next(e);
  }
};

export const setIsOrderingAvailablePut: SetIsOrderingAvailablePut = async (
  req,
  res,
  next
) => {
  try {
    const isOpen = req.body;
    await services.appConfig.setIsOrderingAvailable(isOpen, req?.user?.id);

    res.json({ status: 'OK' });
  } catch (e) {
    next(e);
  }
};
