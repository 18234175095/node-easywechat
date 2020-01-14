'use strict';

import BaseClient from '../Core/BaseClient';

export default class Client extends BaseClient
{

  async send(params: object = {}): Promise<any>
  {
    params['appid'] = this.app['config']['app_id'];
    params['openid_count'] = 1;

    return await this.safeRequestApi('mmpaymkttransfers/send_coupon', params);
  }

  async stock(params: object = {}): Promise<any>
  {
    params['appid'] = this.app['config']['app_id'];

    return await this.requestApi('mmpaymkttransfers/query_coupon_stock', params);
  }

  async info(params: object = {}): Promise<any>
  {
    params['appid'] = this.app['config']['app_id'];

    return await this.requestApi('mmpaymkttransfers/querycouponsinfo', params);
  }

}
