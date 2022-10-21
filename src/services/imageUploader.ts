import { Storage, GetSignedUrlConfig } from '@google-cloud/storage';
import { FileExtensionType } from '../types';

export async function generateUploadSignedUrl({
  itemId,
  fileExtension
}: {
  itemId: string;
  fileExtension: FileExtensionType;
}) {
  const { PROJECT_ID, GCP_SERVICE_ACCOUNT_FILE, BUCKET_NAME } = process.env;

  const storage = new Storage({
    projectId: PROJECT_ID,
    keyFilename: GCP_SERVICE_ACCOUNT_FILE
  });

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
