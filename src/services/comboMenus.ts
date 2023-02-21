import { Model } from '../models';
import { ComboMenuModel, dbQuery } from '../types';

export class ComboMenus {
  constructor(private readonly comboMenuModel: Model<ComboMenuModel>) {}

  public async getComboMenus({ isAvailable }: { isAvailable?: boolean }) {
    let query;

    if (typeof isAvailable === 'boolean') {
      query = ['isAvailable', '==', isAvailable] as dbQuery;
    }

    return this.comboMenuModel.findMany(query);
  }

  public async addComboMenu(comboMenu: ComboMenuModel, userId?: string) {
    await this.comboMenuModel.insertOne(comboMenu, userId);
    const existingComboMenu = await this.getComboMenus({});
    return existingComboMenu.find((dbComboMenu) =>
      Object.entries(comboMenu)
        .filter(([, value]) => typeof value !== 'object')
        .every(([key, value]) => dbComboMenu[key] === value)
    );
  }

  public async updateComboMenus(
    comboMenus: {
      [key: string]: Partial<ComboMenuModel>;
    },
    userId?: string
  ) {
    let updatedComboMenus = Object.entries(comboMenus).map(([id, comboMenu]) =>
      this.comboMenuModel.updateOne(id, comboMenu, userId)
    );
    const updatingResult = await Promise.allSettled(updatedComboMenus);
    return Object.keys(comboMenus).reduce((acc, id) => {
      const dbResult = updatingResult.find(
        (updateResult) =>
          updateResult.status === 'fulfilled' && updateResult.value === id
      );
      console.log(
        'ComboMenusService.updateComboMenus:: updating result:',
        updatingResult
      );
      return {
        ...acc,
        [id]: typeof dbResult === 'object'
      };
    }, {});
  }
}
