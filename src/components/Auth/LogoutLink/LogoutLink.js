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
import { connect } from 'react-redux';
import { logout } from '../../../actions/auth';
import NavItem from '../../NavItem';
import s from './LogoutLink.css';

const LogoutLink = ({ className, logout, children }) => ( // eslint-disable-line no-shadow
  <NavItem className={className} onClick={logout}>{children}</NavItem>
);

LogoutLink.propTypes = {
  className: PropTypes.string,
  logout: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default connect(null, { logout })(withStyles(s)(LogoutLink));
