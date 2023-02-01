import services from '../../services';
import { CategoriesGet, CategoryPost, CategoryPut } from './types';

export const categoriesGet: CategoriesGet = async (req, res, next) => {
  try {
    const categories = await services.categories.getCategories();

    res.json(categories);
  } catch (e) {
    next(e);
  }
};

export const categoryPut: CategoryPut = async (req, res, next) => {
  try {
    const result = await services.categories.updateCategory(
      req.params.categoryId,
      req.body,
      req.user.id
    );

    res.json(result);
  } catch (e) {
    next(e);
  }
};

export const categoryPost: CategoryPost = async (req, res, next) => {
  try {
    const result = await services.categories.addCategory(req.body, req.user.id);

    res.json(result);
  } catch (e) {
    next(e);
  }
};
