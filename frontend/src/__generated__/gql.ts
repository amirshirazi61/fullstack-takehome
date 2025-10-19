/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query GetUsers($filters: UserFilters!) {\n    users(filters: $filters) {\n      id\n      name\n      age\n      email\n      phone\n    }\n  }\n": typeof types.GetUsersDocument,
    "\n  query GetPosts($filters: PostFilters!) {\n    posts(filters: $filters) {\n      id\n      userId\n      title\n      content\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.GetPostsDocument,
};
const documents: Documents = {
    "\n  query GetUsers($filters: UserFilters!) {\n    users(filters: $filters) {\n      id\n      name\n      age\n      email\n      phone\n    }\n  }\n": types.GetUsersDocument,
    "\n  query GetPosts($filters: PostFilters!) {\n    posts(filters: $filters) {\n      id\n      userId\n      title\n      content\n      createdAt\n      updatedAt\n    }\n  }\n": types.GetPostsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetUsers($filters: UserFilters!) {\n    users(filters: $filters) {\n      id\n      name\n      age\n      email\n      phone\n    }\n  }\n"): (typeof documents)["\n  query GetUsers($filters: UserFilters!) {\n    users(filters: $filters) {\n      id\n      name\n      age\n      email\n      phone\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetPosts($filters: PostFilters!) {\n    posts(filters: $filters) {\n      id\n      userId\n      title\n      content\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query GetPosts($filters: PostFilters!) {\n    posts(filters: $filters) {\n      id\n      userId\n      title\n      content\n      createdAt\n      updatedAt\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;