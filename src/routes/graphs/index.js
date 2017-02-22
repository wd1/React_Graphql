/**  -*- mode: react; -*-
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable global-require */

// The top-level (parent) route
export default {

  path: '/explore',

  // Keep in mind, routes are evaluated in order
  children: [
    require('./list').default,
    require('./california').default,
    require('./scholars').default,
    require('./attorneys').default,
    require('./physicians-california').default,
    require('./physicians').default,
    require('./patents').default,
    require('./linkedin').default,
  ],

  async action({ next }) {
    // Execute each child route until one of them return the result
    const route = await next();
    return route;
  },

};
