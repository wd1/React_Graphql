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
    title: 'Scholars',
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
    title: 'Patent Holders',
    description: '',
    image: '/graphs-data/patents/patents.png',
    link: '/explore/patents',
  },
  linkedin: {
    title: 'LinkedIn',
    description: 'Location, Industry, Gender, ...',
    image: '/graphs-data/linkedin/linkedin.png',
    link: '/explore/linkedin',
  },
  healthcare: {
    chiropractors: {
      title: 'Chiropractors',
      description: 'Location, Specialization, Gender',
      image: '/graphs-data/healthcare/chiropractors.png',
      link: '/explore/healthcare/chiropractors',
    },
    pharmacists: {
      title: 'Pharmacists',
      description: 'Location, Classification, Specialization, ...',
      image: '/graphs-data/healthcare/pharmacists.png',
      link: '/explore/healthcare/pharmacists',
    },
    dentists: {
      title: 'Dentists',
      description: 'Location, Specialization, Gender',
      image: '/graphs-data/healthcare/dentists.png',
      link: '/explore/healthcare/dentists',
    },
    physicians: {
      title: 'Physicians',
      description: 'Location, Classification, Specialization, ...',
      image: '/graphs-data/healthcare/physicians.png',
      link: '/explore/healthcare/physicians',
    },
    nurses: {
      title: 'Nurses',
      description: 'Location, Specialization, Gender',
      image: '/graphs-data/healthcare/nurses.png',
      link: '/explore/healthcare/nurses',
    },
    therapists: {
      title: 'Therapists',
      description: 'Location, Classification, Specialization, ...',
      image: '/graphs-data/healthcare/therapists.png',
      link: '/explore/healthcare/therapists',
    },
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
