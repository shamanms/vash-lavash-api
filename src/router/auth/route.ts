import { Middleware, TypedRequestBody } from '../../types';
import jsonwebtoken from 'jsonwebtoken';

export type LoginRequest = Middleware<
  TypedRequestBody<{ username: string; password: string }>
>;

// TODO: get from GCP secret manager
// The secret should be an unguessable long string (you can use a password generator for this!)
const JWT_SECRET =
  'goK!pusp6ThEdURUtRenOwUhAsWUCLheBazl!uJLPlS8EbreWLdrupIwabRAsiBu';

export const login: LoginRequest = async (req, res, next) => {
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
      token: jsonwebtoken.sign({ role: user.role }, JWT_SECRET)
    });
  }

  return res
    .status(401)
    .json({ message: 'The username and password your provided are invalid' });
};
