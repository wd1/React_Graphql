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
import Video from './Video';

const title = 'Introduction Video';

export default {
  path: '/video',
  action() {
    const props = {
      videoId: 'o2VdQvzWTc0',
      duration: (58 * 60) + 56,
      segments: [
        {
          title: 'Intro to IACP - Why it matters - Creating a brand',
          start: 0,
        },
        {
          title: 'What we do, What we don\'t do - Our non-profit status',
          start: (17 * 60) + 30,
        },
        {
          title: 'Technology update - Data obtained so far',
          start: (22 * 60) + 30,
        },
        {
          title: 'Sharing Life Stories',
          start: (36 * 60) + 47,
        },
        {
          title: 'Creating a multi-generational platform - Our roadmap - The teams we need',
          start: (40 * 60) + 20,
        },
        {
          title: 'Our Choices as a community - Conclusion',
          start: (50 * 60) + 45,
        },
      ],
    };

    return {
      title,
      component: <Layout><Video {...props} /></Layout>,
    };
  },
};
