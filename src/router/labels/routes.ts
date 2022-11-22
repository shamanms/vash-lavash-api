import services from '../../services';
import { LabelPost, LabelsGet, LabelsPut } from './types';

export const labelsGet: LabelsGet = async (req, res, next) => {
  try {
    const labels = await services.labels.getLabels();

    res.json(labels);
  } catch (e) {
    next(e);
  }
};

export const labelsPut: LabelsPut = async (req, res, next) => {
  try {
    const result = await services.labels.updateLabels(req.body);

    res.json(result);
  } catch (e) {
    next(e);
  }
};

export const labelPost: LabelPost = async (req, res, next) => {
  try {
    const label = await services.labels.addLabel(req.body);

    res.json(label);
  } catch (e) {
    next(e);
  }
};
