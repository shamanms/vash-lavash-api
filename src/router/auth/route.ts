import jwt from 'jsonwebtoken';
import services from '../../services';
import { LoginRequest } from './types';
import { UserModel } from '../../types';

const isLoginAllowed = (
  credentials: Pick<UserModel, 'username' | 'password'>,
  user: UserModel
): boolean => {
  if (credentials.username !== user?.username) {
    console.log('Invalid username provided');
    return false;
  }

  if (credentials.password !== user?.password) {
    console.log('Invalid password provided');
    return false;
  }

  if (!user?.isActive) {
    console.log('User is not active');
    return false;
  }

  return true;
};

export const login: LoginRequest = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const { JWT_SECRET } = process.env;
    console.log(`User "${username}" is trying to login`);

    const user = await services.users.getUserByName(username);

    if (isLoginAllowed({ username, password }, user) && JWT_SECRET) {
      await services.users.addLoginTimestamp(user);

      console.log(`User "${username}" successfully logged in`);

      return res.json({
        token: jwt.sign(
          {
            id: user.id,
            role: user.role
          },
          JWT_SECRET,
          {
            expiresIn: 9000 // sec
          }
        )
      });
    }

    return res
      .status(401)
      .json({ message: 'The username and password your provided are invalid' });
  } catch (e) {
    next(e);
  }
};
