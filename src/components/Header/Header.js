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
import {
  Navbar,
  Nav,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import Link from '../Link';
import NavItem from '../NavItem';
import LogoutLink from '../Auth/LogoutLink';
import s from './Header.css';

class Header extends React.Component {
  static propTypes = {
    auth: PropTypes.object,
  };

  render() {
    const { auth } = this.props;

    return (
      <Navbar className={s.navbar}>
        <Navbar.Header>
          <Navbar.Brand>
            <Link className={s.brand} to="/">
              <img role="presentation" className={s.logo} src="/logo/logo-full.png" />
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem eventKey={1} href="/">Home</NavItem>
            <NavItem eventKey={2} href="/stories">Contribution Stories</NavItem>
            <NavItem eventKey={3} href="/explore">Explore Data</NavItem>
            <NavItem eventKey={4} href="/aboutus">About Us</NavItem>
          </Nav>
          <hr className={s.divider} />
          <Nav pullRight>
            {/* {!auth.user.id && <NavItem eventKey={5} href="/login">Login</NavItem>} */}
            {auth.user.id && <NavItem eventKey={5} href="/profile">Profile</NavItem>}
            {/* auth.user.admin is working, but we should not rely on it,
                because it could be manipulated on serverside */}
            {auth.user.id && auth.user.admin && <NavItem eventKey={6} href="/admin">Admin</NavItem>}
            {auth.user.id && <LogoutLink eventKey={7}>Logout</LogoutLink>}
            <NavItem className={s.donate} eventKey={8} href="/donate">Donate</NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

function mapStateToProps(state) {
  const { auth } = state;

  return { auth };
}

export default connect(mapStateToProps, null, null, { pure: false })(withStyles(s)(Header));
