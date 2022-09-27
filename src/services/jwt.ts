import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const { PROJECT_ID, JWT_SECRET_NAME, JWT_SECRET_VERSION } = process.env;
const name = `projects/${PROJECT_ID}/secrets/${JWT_SECRET_NAME}/versions/${JWT_SECRET_VERSION}`;
const client = new SecretManagerServiceClient();

export const accessSecretVersion = async function () {
  const [version] = await client.accessSecretVersion({
    name: name
  });

  return version?.payload?.data?.toString() || '';
};
