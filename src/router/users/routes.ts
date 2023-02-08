import { UserGet } from './types';
import services from '../../services';

export const getUser: UserGet = async (req, res, next) => {
  try {
    const user = await services.users.getUserById(req.user.id, [
      'firstName',
      'lastName',
      'role'
    ]);

    return res.json(user);
  } catch (e) {
    next(e);
  }
};
