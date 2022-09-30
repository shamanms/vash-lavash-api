import { Storage } from '@google-cloud/storage';

const bucketName = 'lavash-menu-images';
const { PROJECT_ID, GCP_SERVICE_ACCOUNT_FILE } = process.env;

const storage = new Storage({
  projectId: PROJECT_ID,
  keyFilename: GCP_SERVICE_ACCOUNT_FILE
});

export async function generateUploadSignedUrl(product: {
  productId: string;
  fileExtension: 'jpeg' | 'fileExtension';
}) {
  const options: any = {
    version: 'v4',
    action: 'write',
    expires: Date.now() + 5 * 60 * 1000, // 5 minutes
    contentType: 'application/octet-stream'
  };
  const [url]: any = await storage
    .bucket(bucketName)
    .file(`${product.productId}-${Date.now()}.${product.fileExtension}`) // sdfhrtdhbrvbt-13246547657.jpg
    .getSignedUrl(options);

  return url;
}
