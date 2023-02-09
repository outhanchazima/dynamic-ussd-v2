import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { Menu } from 'src/interfaces/menu.interface';

@Injectable()
export class ConfigProvider {
  private configFilePath;
  private config;

  constructor() {
    this.configFilePath = this.getConfigFilePath();
    this.loadConfigFile();
  }

  // return the file path
  private getConfigFilePath(): string {
    dotenv.config();
    const mode = process.env.MODE || 'DEV';
    return `config.${mode.toLowerCase()}.json`;
  }

  // load the configs from the jsonfile
  public loadConfigFile(): void {
    this.config = JSON.parse(fs.readFileSync(this.configFilePath, 'utf-8'));
  }

  // return the config file already loaded from the file read
  public getConfig(): Promise<Menu> {
    return this.config;
  }
}
