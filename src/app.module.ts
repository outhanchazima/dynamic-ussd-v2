import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigProvider } from './providers/config.provider';
import { SessionProvider } from './providers/session,provider';

@Module({
  imports: [CacheModule.register()],
  controllers: [AppController],
  providers: [AppService, SessionProvider, ConfigProvider],
})
export class AppModule {}
