import { LogLevel } from '@nestjs/common';

/**
 * Application configuration
 *
 * @export
 * @interface IAppConfig
 */
export interface IAppConfig {
  /**
   * Application port
   *
   * @type {number}
   * @memberof IAppConfig
   */
  port: number;

  /**
   * Node environtment state. Valid values: 'development', 'production', 'test', 'provision'.
   *
   * @type {string}
   * @memberof IAppConfig
   */
  nodeEnv: string;

  /**
   * Enable or disable CORS. Default (false)
   *
   * @type {boolean}
   * @memberof IAppConfig
   */
  cors: boolean;

  /**
   * App log level admiseds.
   *
   * @type {LogLevel}
   * @memberof IAppConfig
   */
  logLevel: LogLevel[];

  /**
   * App jwt secret word admiseds.
   *
   * @type {string}
   * @memberof IAppConfig
   */
  jwtSecret: string;
  /**
   * App jwt expiration admiseds.
   *
   * @type {number}
   * @memberof IAppConfig
   */
  jwtExpiration: number;

  /**
  * App host frontend.
  *
  * @type {number}
  * @memberof IAppConfig
  */
  hostFront: string
}
