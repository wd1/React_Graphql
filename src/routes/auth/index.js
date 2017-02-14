/**  -*- mode: react; -*-
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '../../components/Layout';
import Auth from './Auth';

const title = 'Log In';

export default {

  path: '/login',

  action({ store }) {
    const { auth } = store.getState();
    if (auth.user.id) {
      return { redirect: '/profile' };
    }

    return {
      title,
      component: <Layout><Auth title={title} /></Layout>,
    };
  },

};
