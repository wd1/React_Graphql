import React from 'react';

const Disclaimer = () => (
  <h4>
    <strong>Note</strong>: The information presented herein is based on data mined from a variety{' '}
    of public and privately obtained databases. It is as accurate as we have been{' '}
    able to make it, but there can be no guarantee that the summaries and statistics{' '}
    presented are 100 percent accurate, and they should not be relied upon as such.{' '}
    Any comments on the data or its accuracy should be directed to{' '}
    <a href="mailto:info@ia-cp.org">info@ia-cp.org</a>.
  </h4>);

const GraphsData = {
  scholars: {
    title: 'Iranian American Scholars',
    description: 'Location, publications, citations and more',
    image: '/graphs-data/scholars/scholars.png',
    link: '/explore/scholars',
  },
  california: {
    title: 'California Government Data',
    description: 'Teachers, law enforcment ...',
    image: '/graphs-data/california/demo.gif',
    link: '/explore/california',
  },
  attorneys: {
    title: 'California Attorneys',
    description: '',
    image: '/graphs-data/attorneys/attorneys.png',
    link: '/explore/attorneys',
  },
  physiciansCalifornia: {
    title: 'California Physicians',
    description: 'Location, Classification, Specialization, ...',
    image: '/graphs-data/physicians-california/physicians.png',
    link: '/explore/physicians-california',
  },
  patents: {
    title: 'Iranian-American Patent Holders',
    description: '',
    image: '/graphs-data/patents/patents.png',
    link: '/explore/patents',
  },
  linkedin: {
    title: 'Iranian-Americans on LinkedIn',
    description: 'Location, Industry, Gender, ...',
    image: '/graphs-data/linkedin/linkedin.png',
    link: '/explore/linkedin',
  },
  future: {
    title: '',
    description: '',
    image: '/graphs-data/coming-soon.png',
    link: '/404',
  },
};

export default GraphsData;
export { Disclaimer };
