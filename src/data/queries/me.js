/**  -*- mode: react; -*-
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import {
  GraphQLInt as IntType,
} from 'graphql';
import UserType from '../types/UserType';
import { User } from '../models';

const me = {
  type: UserType,
  args: {
    id: { type: IntType, defaultValue: 0 },
  },
  async resolve({ request }) {
    let userid = 0;
    if (request.user) {
      userid = request.user.id;
    } else {
      userid = request.body.id;
    }
    const user = await User.findById(userid);
    return user;
  },
};

export default { me };
