import { Injectable, LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IDataBaseConfig } from '../interfaces/IDataBaseConfig';
import { IAppConfig } from '../interfaces/IAppConfig';
import { ISMTPConfig } from '../interfaces/ISMTPConfig';
import { IGraphqlConfig } from '../interfaces/IGraphqlConfig';
import { IERPConfig } from '../interfaces/IERPConfig';
import { ISyncConfig } from '../interfaces/ISyncConfig';
import { IInventoryClientConfig } from '../interfaces/IInventoryClientConfig';

const logLevels: LogLevel[] = ['verbose', 'debug', 'log', 'warn', 'error'];

function getLogLevel(level: string): LogLevel[] {
  const lvlIndex = logLevels.findIndex(ll => ll === level);
  return logLevels.filter((ll: LogLevel, index: number) => {
    if (lvlIndex <= index) return ll;
  });
}

@Injectable()
export class AppConfigService {
  constructor(private readonly _configService: ConfigService) {
  }

  app: IAppConfig = {
    cors: this._configService.get<boolean>('app.cors'),
    port: this._configService.get<number>('app.port'),
    nodeEnv: this._configService.get<string>('app.nodeEnv'),
    logLevel: getLogLevel(this._configService.get<string>('app.logLevel')),
    jwtSecret: this._configService.get<string>('app.jwtSecret'),
    jwtExpiration: this._configService.get<number>('app.jwtExpiration'),
    hostFront: this._configService.get<string>('app.hostFront')
  };

  database: IDataBaseConfig = {
    type: this._configService.get<string>('database.type'),
    username: this._configService.get<string>('database.username'),
    password: this._configService.get<string>('database.password'),
    connectString:
      this._configService.get<string>('database.connectString') ?? undefined,
    host: this._configService.get<string>('database.host') ?? undefined,
    database: this._configService.get<string>('database.database') ?? undefined,
    synchronize: this._configService.get<boolean>(
      'database.synchronize',
      false,
    ),
  };

  smtp: ISMTPConfig = {
    host: this._configService.get<string>('smtp.host'),
    port: this._configService.get<number>('smtp.port'),
    email: this._configService.get<string>('smtp.email'),
    password: this._configService.get<string>('smtp.password'),
  };

  graphql: IGraphqlConfig = {
    schema: this._configService.get<string>('graphql.schema'),
    maxFiles: this._configService.get<number>('graphql.maxFiles'),
    maxFileSize: this._configService.get<number>('graphql.maxFileSize'),
    depthLimit: this._configService.get<number>('graphql.depthLimit'),
  };

  erp: IERPConfig = {
    url: this._configService.get<string>('erp.url'),
    urlSoap: this._configService.get<string>('erp.urlSoap'),
    version: this._configService.get<string>('erp.version'),
    userName: this._configService.get<string>('erp.userName'),
    password: this._configService.get<string>('erp.password'),
    employeeName: this._configService.get<string>('erp.employeeName'),
    soapUserName: this._configService.get<string>('erp.soapUserName'),
    soapPassword: this._configService.get<string>('erp.soapPassword'),
  };

  sync: ISyncConfig = {
    syncronize: this._configService.get<boolean>('sync.syncronize'),
    syncLocatorInterval: this._configService.get<number>(
      'sync.syncLocatorInterval',
    ),
    syncSubInventoryInterval: this._configService.get<number>(
      'sync.syncSubinventoryInterval',
    ),
    syncInventoryOrganizationInterval: this._configService.get<number>(
      'sync.syncInventoryOrganizationInterval',
    ),
    syncItemInterval: this._configService.get<number>('sync.syncItemInterval'),
  };

  inventoryClient: IInventoryClientConfig = {
    url: this._configService.get<string>('inventoryClient.url'),
    port: this._configService.get<string>('inventoryClient.port'),
    rabbitmqUrl: this._configService.get<string>('inventoryClient.rabbitmqUrl'),
    queueName: this._configService.get<string>('inventoryClient.queueName'),
  };
}
