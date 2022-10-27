import { AdditivesGet, AdditivesPost, AdditivesPut } from './types';
import services from '../../services';

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
    const result = await services.additives.updateAdditives(req.body);

    res.json(result);
  } catch (e) {
    next(e);
  }
};

export const additivesPost: AdditivesPost = async (req, res, next) => {
  try {
    const additive = await services.additives.addAdditive(req.body);

    res.json(additive);
  } catch (e) {
    next(e);
  }
};
