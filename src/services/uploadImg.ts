import { Storage } from '@google-cloud/storage';

const { PROJECT_ID, GCP_SERVICE_ACCOUNT_FILE, BUCKET_NAME } = process.env;

const storage = new Storage({
  projectId: PROJECT_ID,
  keyFilename: GCP_SERVICE_ACCOUNT_FILE
});

export async function generateUploadSignedUrl(product: {
  productId: string;
  fileExtension: 'jpeg' | 'jpg';
}) {
  if (!BUCKET_NAME) {
    throw new Error('BUCKET_NAME is invalid');
  }
  const options: any = {
    version: 'v4',
    action: 'write',
    expires: Date.now() + 5 * 60 * 1000, // 5 minutes
    contentType: 'application/octet-stream'
  };
  const [url]: any = await storage
    .bucket(BUCKET_NAME)
    .file(`${product.productId}-${Date.now()}.${product.fileExtension}`)
    .getSignedUrl(options);

  return url;
}
