/**  -*- mode: react; -*-
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '../../../components/Layout';
import Physicians from './Physicians';

const title = 'Physicians';

export default {
  path: '/physicians',
  action() {
    return {
      title,
      component: <Layout><Physicians title={title} /></Layout>,
    };
  },

};
