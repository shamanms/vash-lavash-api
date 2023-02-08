import { Model } from '../models';
import { UserModel } from '../types';

export class UsersService {
  constructor(private readonly usersModel: Model<UserModel>) {}

  public async getUserByName(username: string) {
    const users = await this.usersModel.findMany(['username', '==', username]);
    return users[0];
  }

  public async getUserById(id: string) {
    return this.usersModel.findOneById(id);
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
