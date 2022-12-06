import jwt from 'jsonwebtoken';
import services from '../../services';
import { LoginRequest } from './types';

export const login: LoginRequest = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const { JWT_SECRET } = process.env;
    console.log(`${username} is trying to login ..`);

    const user = await services.users.getUser(username);

    if (
      username === user?.username &&
      password === user.password &&
      JWT_SECRET
    ) {
      await services.users.addLoginTimestamp(user);
      return res.json({
        token: jwt.sign(
          {
            id: user.id,
            role: user.role
          },
          JWT_SECRET,
          {
            expiresIn: 900 // sec
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
