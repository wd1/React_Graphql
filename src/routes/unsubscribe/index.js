import React from 'react';
import Unsubscribe from './Unsubscribe';
import Layout from '../../components/Layout';
import fetch from '../../core/fetch';

const title = 'Unsubscribe';

export default {

  path: '/unsubscribe',

  async action({ query }) {
    const unsubKey = query.key;
    const resp = await fetch('/graphql', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `{ unsubData(key:"${unsubKey}"){ email, errors{ key } } }`,
      }),
    });
    if (resp.status !== 200) throw new Error(resp.statusText);
    const { data } = await resp.json();
    if (!data.unsubData) throw new Error('Error in API call!');

    return {
      title,
      component: <Layout><Unsubscribe unsubKey={unsubKey} {...data.unsubData} /></Layout>,
    };
  },
};
