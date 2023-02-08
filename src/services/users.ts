import { Model } from '../models';
import { UserModel } from '../types';

export class UsersService {
  constructor(private readonly usersModel: Model<UserModel>) {}

  public async getUserByName(username: string) {
    const users = await this.usersModel.findMany(['username', '==', username]);
    return users[0];
  }

  public async getUserById(id: string, projection?: (keyof UserModel)[]) {
    const user = await this.usersModel.findOneById(id);

    if (user && Array.isArray(projection)) {
      return projection.reduce(
        (acc, key) => ({
          ...acc,
          [key]: user[key]
        }),
        {} as Partial<UserModel>
      );
    }

    return user;
  }

  public async addLoginTimestamp(user: UserModel) {
    if (user?.id) {
      return this.usersModel.updateOne(
        user.id,
        {
          loginDates: [...user.loginDates, Date.now()]
        },
        user.id
      );
    }
    new Error('UsersService.addLoginTimestamp:: invalid user id');
  }
}
