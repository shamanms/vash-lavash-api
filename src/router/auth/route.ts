import { Middleware, TypedRequestBody } from '../../types';
import jsonwebtoken from 'jsonwebtoken';
import services from '../../services';
import { accessSecretVersion } from '../../services/jwt';

export type LoginRequest = Middleware<
  TypedRequestBody<{ username: string; password: string }>
>;

export const login: LoginRequest = async (req, res, next) => {
  try {
    const jwtSecret = await accessSecretVersion();
    const { username, password } = req.body;
    console.log(`${username} is trying to login ..`);

    const user = await services.users.getUser(req.body.username);

    if (username === user.username && password === user.password) {
      await services.users.addLoginTimestamp(user);
      return res.json({
        token: jsonwebtoken.sign({ id: user.id, role: user.role }, jwtSecret)
      });
    }

    return res
      .status(401)
      .json({ message: 'The username and password your provided are invalid' });
  } catch (e) {
    next(e);
  }
};
