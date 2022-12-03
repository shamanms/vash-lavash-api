import { Storage, GetSignedUrlConfig } from '@google-cloud/storage';
import { StorageOptions } from '@google-cloud/storage/build/src/storage';
import { FileExtensionType } from '../types';

export async function generateUploadSignedUrl({
  itemId,
  fileExtension
}: {
  itemId: string;
  fileExtension: FileExtensionType;
}) {
  const {
    PROJECT_ID,
    SERVICE_ACCOUNT_PRIVATE_KEY,
    SERVICE_ACCOUNT_EMAIL,
    GCP_SERVICE_ACCOUNT_FILE,
    BUCKET_NAME
  } = process.env;

  const storageConfig: StorageOptions = {
    projectId: PROJECT_ID,
    credentials: {
      private_key: SERVICE_ACCOUNT_PRIVATE_KEY,
      client_email: SERVICE_ACCOUNT_EMAIL
    }
  };

  if (GCP_SERVICE_ACCOUNT_FILE) {
    console.log(
      'generateUploadSignedUrl: receied GCP_SERVICE_ACCOUNT_FILE:',
      GCP_SERVICE_ACCOUNT_FILE
    );
    delete storageConfig.credentials;
    storageConfig.keyFilename = GCP_SERVICE_ACCOUNT_FILE;
  }

  const storage = new Storage(storageConfig);

  if (!BUCKET_NAME) {
    throw new Error('BUCKET_NAME is invalid');
  }
  const options: GetSignedUrlConfig = {
    version: 'v4',
    action: 'write',
    expires: Date.now() + 5 * 60 * 1000, // 5 minutes
    contentType: 'application/octet-stream'
  };
  const [url] = await storage
    .bucket(BUCKET_NAME)
    .file(`${itemId}-${Date.now()}.${fileExtension}`)
    .getSignedUrl(options);

  return url;
}
