import { Model } from '../models';
import { UserModel } from '../types';

export class UsersService {
  constructor(private readonly usersModel: Model<UserModel>) {}

  public async getUser(username: string) {
    const users = await this.usersModel.findMany(['username', '==', username]);
    return users[0];
  }
}
