import { Model } from '../models';
import { AppConfigModel } from '../types';

export class AppConfigService {
  constructor(
    private readonly appConfig: Model<AppConfigModel>,
    private readonly configId = ''
  ) {}

  public async getAppConfig() {
    return this.appConfig.findOneById(this.configId);
  }

  public async setIsOrderingAvailable(setOpen: Pick<AppConfigModel, 'isOpen'>) {
    if (this.configId) {
      console.log(
        'AppConfigService.setIsOrderingAvailable:: updating result:',
        setOpen
      );
      await this.appConfig.updateOne(this.configId, setOpen);
    } else {
      return new Error('AppConfigId is wrong');
    }
  }
}
