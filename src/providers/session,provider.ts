import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
@Injectable()
export class SessionProvider {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  public async getSessionState(sessionid: string): Promise<string> {
    return await this.cacheManager.get(sessionid);
  }

  public async setSessionState(
    sessionid: string,
    state: string,
  ): Promise<void> {
    return await this.cacheManager.set(sessionid, state);
  }
}
