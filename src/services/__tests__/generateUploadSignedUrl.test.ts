import { generateUploadSignedUrl } from '../imageUploader';
import { Storage } from '@google-cloud/storage';

jest.mock('@google-cloud/storage');
const bucketMethod = jest.fn();
const fileMethod = jest.fn();
const getSignedUrlMethod = jest.fn(() => [1]);
// @ts-ignore
Storage.mockImplementation(() => ({
  bucket: bucketMethod.mockImplementation(() => ({
    file: fileMethod.mockImplementation(() => ({
      getSignedUrl: getSignedUrlMethod
    }))
  }))
}));

const nowDate = Date.now();
const options = {
  version: 'v4',
  action: 'write',
  expires: nowDate + 5 * 60 * 1000,
  contentType: 'application/octet-stream'
};

describe('service.generateUploadSignedUrl', () => {
  beforeEach(() => {
    jest.resetModules();
    global.Date.now = jest.fn(() => nowDate);
  });

  test('when called with product should return url', async () => {
    const BUCKET_NAME = 'testBucket';
    process.env = {
      ...process.env,
      BUCKET_NAME
    };

    const product = {
      productId: 'bulka',
      fileExtension: 'jpg'
    };
    // @ts-ignore
    const result = await generateUploadSignedUrl(product);

    expect(bucketMethod).toHaveBeenCalledWith(BUCKET_NAME);
    expect(fileMethod).toHaveBeenCalledWith(
      `${product.productId}-${nowDate}.${product.fileExtension}`
    );
    expect(getSignedUrlMethod).toHaveBeenCalledWith(options);
    expect(result).toEqual(1);
  });
});
