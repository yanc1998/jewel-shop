/**
 * ERP syncronization configuration
 *
 * @export
 * @interface ISyncConfig
 */
export interface ISyncConfig {
  /**
   * If ERP syncronization is active
   *
   * @type {boolean}
   * @memberof ISyncConfig
   */
  syncronize?: boolean;

  /**
   * Time in milliseconds to syncronize the locators with the ERP
   *
   * @type {number}
   * @memberof ISyncConfig
   */
  syncLocatorInterval?: number;

  /**
   * Time in milliseconds to syncronize the subInventories with the ERP
   *
   * @type {number}
   * @memberof ISyncConfig
   */
  syncSubInventoryInterval?: number;

  /**
   * Time in milliseconds to syncronize the inventory Organizations with the ERP
   *
   * @type {number}
   * @memberof ISyncConfig
   */
  syncInventoryOrganizationInterval?: number;

  /**
   * Time in milliseconds to syncronize the Items with the ERP
   *
   * @type {number}
   * @memberof ISyncConfig
   */
  syncItemInterval?: number;
}
