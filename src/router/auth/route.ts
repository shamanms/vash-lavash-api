import { Middleware, TypedRequestBody } from '../../types';
import jsonwebtoken from 'jsonwebtoken';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

export type LoginRequest = Middleware<
  TypedRequestBody<{ username: string; password: string }>
>;
const { PROJECT_ID, JWT_SECRET_NAME, JWT_SECRET_VERSION } = process.env;
const name = `projects/${PROJECT_ID}/secrets/${JWT_SECRET_NAME}/versions/${JWT_SECRET_VERSION}`;
const client = new SecretManagerServiceClient();

async function accessSecretVersion() {
  const [version] = await client.accessSecretVersion({
    name: name
  });

  return version?.payload?.data?.toString() || '';
}

export const login: LoginRequest = async (req, res, next) => {
  try {
    const jwtSecret = await accessSecretVersion();
    const { username, password } = req.body;
    console.log(`${username} is trying to login ..`);

    // TODO: get from DB Model + Service
    const user = {
      username: 'admin',
      password: 'mySecretPwd',
      role: 'admin'
    };

    if (username === user.username && password === user.password) {
      return res.json({
        token: jsonwebtoken.sign({ role: user.role }, jwtSecret)
      });
    }

    return res
      .status(401)
      .json({ message: 'The username and password your provided are invalid' });
  } catch (e) {
    next(e);
  }
};
