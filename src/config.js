/**  -*- mode: react; -*-
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable max-len */

export const port = process.env.PORT || 3000;
export const host = process.env.WEBSITE_HOSTNAME || `localhost:${port}`;
export const baseUrl = __DEV__ ? `http://localhost:${port}` : 'https://ia-cp.org';

export const analytics = {

  // https://analytics.google.com/
  // apply only in production
  google: {
    trackingId: __DEV__ ? undefined : 'UA-90703769-1',
  },

};

export const auth = {

  jwt: {
    expires: 60 * 60 * 24 * 180, // 180 days
  },

  // https://developers.facebook.com/
  facebook: {
    id: process.env.FACEBOOK_APP_ID || '186244551745631',
    secret: process.env.FACEBOOK_APP_SECRET || 'a970ae3240ab4b9b8aae0f9f0661c6fc',
  },

  // https://cloud.google.com/console/project
  google: {
    id: process.env.GOOGLE_CLIENT_ID || '251410730550-ahcg0ou5mgfhl8hlui1urru7jn5s12km.apps.googleusercontent.com',
    secret: process.env.GOOGLE_CLIENT_SECRET || 'Y8yR9yZAhm9jQ8FKAL8QIEcd',
  },

  // https://apps.twitter.com/
  twitter: {
    key: process.env.TWITTER_CONSUMER_KEY || 'Ie20AZvLJI2lQD5Dsgxgjauns',
    secret: process.env.TWITTER_CONSUMER_SECRET || 'KTZ6cxoKnEakQCeSpZlaUCJWGAlTEBJj0y2EMkUBujA7zWSvaQ',
  },

};

// Stripe: Remember to update secret key too
const STRIPEPUBKEY_TEST = 'pk_test_dFBplEwg5DaDpcFjRrpID8VY';
const STRIPEPUBKEY_LIVE = 'pk_live_D1pVVtjXwFYQkI6JPq3jEAI8';
export const STRIPEPUBKEY = __DEV__ ? STRIPEPUBKEY_TEST : STRIPEPUBKEY_LIVE;

// Email BCC Copy
const MY_EMAIL = 'hamed.ty@gmail.com'; // make sure this is added to AWS dev key permissions
const INFO_EMAIL = 'info@ia-cp.org';
export const BCC_EMAIL = __DEV__ ? MY_EMAIL : INFO_EMAIL;
