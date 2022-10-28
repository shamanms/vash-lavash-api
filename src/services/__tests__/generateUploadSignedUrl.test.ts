import { generateUploadSignedUrl } from '../imageUploader';
import { Storage } from '@google-cloud/storage';

jest.mock('@google-cloud/storage');
const signedUrl = 'http://some.url/img';
const storage = {
  bucket: jest.fn().mockReturnThis(),
  file: jest.fn().mockReturnThis(),
  getSignedUrl: jest.fn(() => [signedUrl])
};
// @ts-ignore
Storage.mockImplementation(() => storage);

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

  test('when called with item should return url', async () => {
    const BUCKET_NAME = 'testBucket';
    process.env = {
      ...process.env,
      BUCKET_NAME
    };

    const item = {
      itemId: 'someId',
      fileExtension: 'jpg'
    };
    // @ts-ignore
    const result = await generateUploadSignedUrl(item);

    expect(storage.bucket).toHaveBeenCalledWith(BUCKET_NAME);
    expect(storage.file).toHaveBeenCalledWith(
      `${item.itemId}-${nowDate}.${item.fileExtension}`
    );
    expect(storage.getSignedUrl).toHaveBeenCalledWith(options);
    expect(result).toEqual(signedUrl);
  });
  test('when bucket name undefined should return Error "BUCKET_NAME is invalid"', async () => {
    const BUCKET_NAME = undefined;
    const item = {
      itemId: 'sumId',
      fileExtension: 'jpg'
    };
    process.env = {
      ...process.env,
      BUCKET_NAME
    };
    try {
      // @ts-ignore
      await generateUploadSignedUrl(item);
    } catch (e: any) {
      expect(e?.message).toMatch('BUCKET_NAME is invalid');
    }
  });
});
