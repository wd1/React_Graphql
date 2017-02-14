/**  -*- mode: react; -*-
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import { Nav, NavItem, Tab } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Login from '../../components/Auth/Login';
import Register from '../../components/Auth/Register';
import Forgot from '../../components/Auth/Forgot';
import s from './Auth.css';

class Auth extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      confirmpassword: '',
      activeTab: 1,
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  tabSelect = (key) => {
    this.setState({ activeTab: key });
  }

  render() {
    const activeTab = this.state.activeTab;
    return (
      <Tab.Container id="tabs-with-dropdown" activeKey={activeTab} onSelect={this.tabSelect}>
        <div className={s.root}>
          <div className={s.container}>
            <Nav bsStyle="tabs" justified>
              <NavItem eventKey={1} title="login">Login</NavItem>
              <NavItem eventKey={2} title="register">Register</NavItem>
              {activeTab === 3 &&
                <NavItem eventKey={3} title="forgot">Forgot Password</NavItem>
              }
            </Nav>
            <Tab.Content animation>
              <Tab.Pane eventKey={1}>
                <Login
                  email={this.state.email}
                  password={this.state.password}
                  handleChange={this.handleChange}
                  tabSelect={this.tabSelect}
                />
              </Tab.Pane>
              <Tab.Pane eventKey={2}>
                <Register
                  email={this.state.email}
                  password={this.state.password}
                  confirmpassword={this.state.confirmpassword}
                  handleChange={this.handleChange}
                />
              </Tab.Pane>
              <Tab.Pane eventKey={3}>
                <Forgot
                  email={this.state.email}
                  handleChange={this.handleChange}
                />
              </Tab.Pane>
            </Tab.Content>
          </div>
        </div>
      </Tab.Container>
    );
  }
}

export default withStyles(s)(Auth);
