/**
 * ERP Client configuration
 *
 * @export
 * @interface IERPConfig
 */
export interface IERPConfig {
  /**
   * URL base for all request.
   *
   * @type {string}
   * @memberof IERPConfig
   */
  url?: string;

  /**
   * URL for soap request.
   *
   * @type {string}
   * @memberof IERPConfig
   */
  urlSoap?: string;

  /**
   * API version.
   *
   * @type {string}
   * @memberof IERPConfig
   */
  version?: string;
  /**
   * UserName Credentials.
   *
   * @type {string}
   * @memberof IERPConfig
   */
  userName?: string;
  /**
   * Password Credentials.
   *
   * @type {string}
   * @memberof IERPConfig
   */
  password?: string;

  /**
   * Employee Name Credentials.
   *
   * @type {string}
   * @memberof IERPConfig
   */
  employeeName?: string;

  /**
   * SOAP UserName Credentials.
   *
   * @type {string}
   * @memberof IERPConfig
   */
  soapUserName?: string;
  /**
   * SOAP Password Credentials.
   *
   * @type {string}
   * @memberof IERPConfig
   */
  soapPassword?: string;
}
