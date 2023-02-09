import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  public getSelectionFromUser(options) {
    const input = prompt(options.join('\n'));
    return input;
  }

  getHello(): string {
    return 'Hello World!';
  }
}
