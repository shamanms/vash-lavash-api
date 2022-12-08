import { UserModel } from '../../src/types';

declare global {
  namespace Express {
    interface Request {
      user: Pick<UserModel, 'id' | 'role'>;
    }
  }
}
