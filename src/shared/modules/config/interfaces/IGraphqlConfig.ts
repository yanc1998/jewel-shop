/**
 * Graphql specific configuration options
 *
 * @export
 * @interface IGraphqlConfig
 */
export interface IGraphqlConfig {
  /**
   * Graphql schema path. Default (schema.gql).
   *
   * @type {string} @memberof IGraphqlConfig */
  schema: string;
  /**
   * Max file size in graphql upload. Default (0).
   *
   * @type {number}
   * @memberof IGraphqlConfig
   */
  maxFileSize?: number;
  /**
   * Max number of files in graphql upload. Default (0).
   *
   * @type {number}
   * @memberof IGraphqlConfig
   */
  maxFiles?: number;

  /**
   * Limit the complexity of the queries solely by their depth.
   *
   * @type {number}
   * @memberof IGraphqlConfig
   */
  depthLimit: number;
}
