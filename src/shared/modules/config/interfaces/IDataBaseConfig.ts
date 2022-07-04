/**
 * Database configuration
 *
 * @export
 * @interface IDataBaseConfig
 */
export interface IDataBaseConfig {
  /**
   * Database type. Ex('oracle', 'postgres', etc)
   *
   * @type {string}
   * @memberof IDataBaseConfig
   */
  type: string;
  /**
   * Database username.
   *
   * @type {string}
   * @memberof IDataBaseConfig
   */
  username: string;
  /**
   * Database user password.
   *
   * @type {string}
   * @memberof IDataBaseConfig
   */
  password: string;
  /**
   * Database connection string. Could be useful with oracleDb.
   *
   * @type {string}
   * @memberof IDataBaseConfig
   */
  connectString?: string;

  /**
   * Database host. Could be included in connection string.
   *
   * @type {string}
   * @memberof IDataBaseConfig
   */
  host?: string;

  /**
   * Database name. Could be included in connection string.
   *
   * @type {string}
   * @memberof IDataBaseConfig
   */
  database?: string;

  /**
   * Database synchronize.
   *
   * @type {boolean}
   * @memberof IDataBaseConfig
   */
  synchronize?: boolean;
}
