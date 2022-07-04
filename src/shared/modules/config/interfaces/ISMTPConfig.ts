/**
 * Notification service configuration
 *
 * @export
 * @interface ISMTPConfig
 */
export interface ISMTPConfig {
  /**
   * Sender email.
   *
   * @type {string}
   * @memberof ISMTPConfig
   */
  email?: string;
  /**
   * SMTP service port.
   *
   * @type {number}
   * @memberof ISMTPConfig
   */
  port?: number;
  /**
   * SMTP host.
   *
   * @type {string}
   * @memberof ISMTPConfig
   */
  host?: string;
  /**
   * Sender password.
   *
   * @type {string}
   * @memberof ISMTPConfig
   */
  password?: string;
}
