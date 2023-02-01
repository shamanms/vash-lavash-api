import { Model } from '../models';
import { CategoryModel } from '../types';

export class Categories {
  constructor(private readonly categoryModel: Model<CategoryModel>) {}

  public async getCategories() {
    return this.categoryModel.findMany();
  }

  public async addCategory(category: CategoryModel, userId?: string) {
    return await this.categoryModel.insertOne(category, userId);
  }

  public async updateCategory(
    categoryId: string,
    category: Partial<CategoryModel>,
    userId?: string
  ) {
    return this.categoryModel.updateOne(categoryId, category, userId);
  }
}
