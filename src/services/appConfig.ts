import { Model } from '../models';
import { AppConfigModel } from '../types';

export class AppConfigService {
  constructor(
    private readonly appConfig: Model<AppConfigModel>,
    private readonly configId = ''
  ) {}

  public async getAppConfig() {
    if (this.configId) {
      return this.appConfig.findOneById(this.configId);
    }
    throw new Error('AppConfigId is wrong');
  }

  public async setIsOrderingAvailable(setOpen: Pick<AppConfigModel, 'isOpen'>) {
    if (this.configId) {
      console.log(
        'AppConfigService.setIsOrderingAvailable:: updating result:',
        setOpen
      );
      await this.appConfig.updateOne(this.configId, setOpen);
    } else {
      throw new Error('AppConfigId is wrong');
    }
  }
}
