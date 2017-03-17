/** -*- mode: react; -*-
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
  GraphQLObjectType as ObjectType,
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLBoolean as BooleanType,
} from 'graphql';
import GraphQLDate from 'graphql-date';

const DonationType = new List(new ObjectType({
  name: 'Donation',
  fields: {
    amount: { type: IntType },
    email: { type: StringType },
    fullName: { type: StringType },
    zipCode: { type: StringType },
    last4: { type: IntType },
    exp_month: { type: IntType },
    exp_year: { type: IntType },
    brand: { type: StringType },
    country: { type: StringType },
    status: { type: StringType },
    announceAmount: { type: BooleanType },
    announceName: { type: BooleanType },
    updatedAt: { type: GraphQLDate },
  },
}));

export default DonationType;
