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
import fetch from '../../core/fetch';
import Admin from './Admin';

const title = 'Admin Page';

export default {

  path: '/admin',

  async action({ store }) {
    const { auth } = store.getState();
    if (!auth.user.id) {
      // it's only a helper, we do not rely on store information
      return { redirect: '/login' };
    }

    if (!auth.user.admin) {
      // it's only a helper, we do not rely on store information
      return { redirect: '/' };
    }

    const subscriptionsResp = await fetch('/graphql', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `{
          admin {
            subscriptions {
              email
              active
            }
            donations {
              amount
              email
              fullName
              zipCode
              last4
              exp_month
              exp_year
              brand
              country
              status
              announceAmount
              announceName
              updatedAt
            }
            errors {
              key
              message
            }
          }
        }`,
      }),
      credentials: 'include',
    });

    if (subscriptionsResp.status !== 200) throw new Error(subscriptionsResp.statusText);
    const SubscriptionsData = await subscriptionsResp.json();
    if (!SubscriptionsData.data) return { redirect: '/' };

    const admin = SubscriptionsData.data.admin;

    /* const Admin = await new Promise((resolve) => {
     *   require.ensure([], (require) => resolve(require('./Admin').default), 'admin');
     * });
     */
    return {
      title,
      chunk: 'admin',
      component: <Layout><Admin admin={admin} /></Layout>,
    };
  },

};
