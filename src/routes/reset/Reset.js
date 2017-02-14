/**  -*- mode: react; -*-
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import ResetComponent from '../../components/Auth/Reset';
import s from './Reset.css';

class Reset extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      password: '',
      confirmpassword: '',
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { password, confirmpassword } = this.state;
    return (
      <div className={s.root}>
        <div className={s.container}>
          <ResetComponent
            password={password}
            confirmpassword={confirmpassword}
            token={this.props.token}
            handleChange={this.handleChange}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Reset);
