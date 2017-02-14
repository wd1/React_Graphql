/**  -*- mode: react; -*-
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';

// Queries
import userQuery from './queries/user';
import content from './queries/content';
import subscribeQuery from './queries/subscription';
import adminQuery from './queries/admin';

// Mutations
import userMutation from './mutations/user';
import subscribeMutation from './mutations/subscription';

const schema = new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: {
      ...userQuery,
      ...subscribeQuery,
      ...adminQuery,
      content,
    },
  }),
  mutation: new ObjectType({
    name: 'Mutation',
    fields: {
      ...userMutation,
      ...subscribeMutation,
    },
  }),
});

export default schema;
