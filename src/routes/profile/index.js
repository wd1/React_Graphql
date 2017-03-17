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
import Profile from './Profile';
import fetch from '../../core/fetch';

const title = 'Profile';

export default {

  path: '/profile',

  async action({ store }) {
    const { auth } = store.getState();
    if (!auth.user.id) {
      // this is only for user experience, we can not rely on auth.user.id
      return { redirect: '/login' };
    }

    const resp = await fetch('/graphql', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `{
          myDonations {
            donations {
              amount
              last4
              exp_month
              exp_year
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
    const { data } = await resp.json();

    // redirect to '/' if no result is returned
    if (!data || !data.myDonations) return { redirect: '/' };

    const donation = data.myDonations;

    return {
      title,
      component: <Layout><Profile title={title} donation={donation} /></Layout>,
    };
  },

};
