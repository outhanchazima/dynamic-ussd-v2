import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
@Injectable()
export class SessionProvider {
  TTL = 300000; // 5 minutes cache expiry

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  public async getSessionState(sessionid: string): Promise<string> {
    return await this.cacheManager.get(sessionid);
  }

  public async setSessionState(
    sessionid: string,
    state: string,
  ): Promise<void> {
    return await this.cacheManager.set(sessionid, state, this.TTL);
  }

  public async getStateData(state: string, config: object): Promise<any> {
    return await config[state];
  }

  public async clearSessionState(sessionid: string): Promise<void> {
    return await this.cacheManager.del(sessionid);
  }
}
