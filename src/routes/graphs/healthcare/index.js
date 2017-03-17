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
import Healthcare from './Healthcare';

const capitalizeFirstLetter = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const categories = {
  chiropractors: {
    graphs: ['specialization'],
  },
  pharmacists: {
    graphs: ['specialization'],
  },
  dentists: {
    graphs: ['specialization'],
  },
  physicians: {
    graphs: ['type', 'classification', 'specialization'],
  },
  nurses: {
    graphs: ['type', 'classification', 'specialization'],
  },
  therapists: {
    graphs: ['type', 'classification', 'specialization'],
  },
};

export default {
  path: '/healthcare/*',
  action({ path }) {
    const category = path.split('/')[2];

    if (!Object.prototype.hasOwnProperty.call(categories, category)) {
      return undefined;
    }
    const title = capitalizeFirstLetter(category);
    const graphs = categories[category].graphs;
    return {
      title,
      component: <Layout><Healthcare category={category} graphs={graphs} /></Layout>,
    };
  },

};
