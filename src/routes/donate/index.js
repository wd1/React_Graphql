import React from 'react';
import Donate from './Donate';
import Layout from '../../components/Layout';

const title = 'Donate';

export default {

  path: '/donate',

  action() {
    return {
      title,
      component: <Layout><Donate title={title} /></Layout>,
    };
  },

};
