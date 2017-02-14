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

  path: '/',

  // Keep in mind, routes are evaluated in order
  children: [
    require('./home').default,
    require('./contact').default,
    require('./auth').default,
    require('./reset').default,
    require('./admin').default,
    require('./donate').default,
    require('./unsubscribe').default,
    require('./graphs/list').default,
    require('./graphs/california').default,
    require('./graphs/scholars').default,
    require('./graphs/attorneys').default,
    require('./graphs/physicians').default,
    require('./graphs/patents').default,
    require('./graphs/linkedin').default,
    require('./stories').default,
    require('./video').default,
    require('./profile').default,

    // place new routes before...
    require('./content').default,
    require('./notFound').default,
  ],

  async action({ next }) {
    // Execute each child route until one of them return the result
    const route = await next();

    // Provide default values for title, description etc.
    route.title = `${route.title || 'Untitled Page'}`;
    route.description = route.description || '';

    return route;
  },

};
