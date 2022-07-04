/**
 * Inventory Client configuration
 *
 * @export
 * @interface IInventoryClientConfig
 */
export interface IInventoryClientConfig {
  /**
   * URL base for all request.
   *
   * @type {string}
   * @memberof IInventoryClientConfig
   */
  url?: string;

  /**
   * Port for all request.
   *
   * @type {string}
   * @memberof IInventoryClientConfig
   */
  port?: string;

  rabbitmqUrl?: string;

  queueName?: string;
}
