import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Footer.css';
import Link from '../Link';

class Footer extends React.Component {
  render() {
    const fullName = 'IACP - Iranian Americans\' Contributions Project';
    return (
      <div className={s.root}>
        <div className={s.container}>
          <span className={s.text}>© {fullName}</span>
          <span className={s.spacer}> · </span>
          <Link className={s.link} to="/">Home</Link>
          <span className={s.spacer}> · </span>
          <Link className={s.link} to="/stories">Contribution Stories</Link>
          <span className={s.spacer}> · </span>
          <Link className={s.link} to="/explore">Explore Data</Link>
          {/* <span className={s.spacer}> · </span>
          <Link className={s.link} to="/about">About</Link> */}
          <span className={s.spacer}> · </span>
          <Link className={s.link} to="/privacy">Privacy</Link>
          <span className={s.spacer}> · </span>
          <Link className={s.link} to="/donate">Donate</Link>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Footer);
