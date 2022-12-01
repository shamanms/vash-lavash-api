import { AppConfigService } from '../appConfig';
import db from '../../models';

const appConfigTest = {
  isOpen: true
};
const APP_CONFIG_ID = '1';

jest.mock('../../models', () => ({
  appConfig: {
    findOneById: jest.fn().mockImplementation(() => appConfigTest),
    updateOne: jest.fn().mockImplementation(() => appConfigTest)
  }
}));

describe('AppConfigService.getAppConfig', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('should return appConfig', async () => {
    const service = new AppConfigService(db.appConfig, APP_CONFIG_ID);
    const result = await service.getAppConfig();
    expect(db.appConfig.findOneById).toHaveBeenCalledWith(APP_CONFIG_ID);
    expect(result).toEqual(appConfigTest);
  });

  test('when APP_CONFIG_ID = undefined call db with ""', async () => {
    const service = new AppConfigService(db.appConfig, undefined);
    await service.getAppConfig();
    expect(db.appConfig.findOneById).toHaveBeenCalledWith('');
  });
});

describe('AppConfigService.setIsOrderingAvailable', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('should set appConfig.isOpen "false"', async () => {
    jest.spyOn(console, 'log').mockImplementation();
    const param = { isOpen: false };
    const service = new AppConfigService(db.appConfig, APP_CONFIG_ID);
    const result = await service.setIsOrderingAvailable(param);

    expect(db.appConfig.updateOne).toHaveBeenCalledWith(APP_CONFIG_ID, param);
    expect(console.log).toHaveBeenCalled();
    expect(result).toEqual(undefined);
  });

  test('should set appConfig.isOpen "true"', async () => {
    jest.spyOn(console, 'log').mockImplementation();
    const param = { isOpen: true };
    const service = new AppConfigService(db.appConfig, APP_CONFIG_ID);
    const result = await service.setIsOrderingAvailable(param);

    expect(db.appConfig.updateOne).toHaveBeenCalledWith(APP_CONFIG_ID, param);
    expect(console.log).toHaveBeenCalled();
    expect(result).toEqual(undefined);
  });

  test('when APP_CONFIG_ID = undefined call db with ""', async () => {
    const service = new AppConfigService(db.appConfig, undefined);
    const isOpen = { isOpen: true };
    try {
      await service.setIsOrderingAvailable(isOpen);
    } catch (e: any) {
      expect(e).toBeInstanceOf(Error);
      expect(e?.message).toMatch('AppConfigId is wrong');
      expect(db.appConfig.updateOne).not.toHaveBeenCalled();
    }
  });
});
