/**  -*- mode: react; -*-
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import { Form,
         FormGroup,
         ControlLabel,
         FormControl,
         Button,
         Alert } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import { login } from '../../../actions/auth';
import SocialLogin from '../SocialLogin';
import s from './Login.css';

class Login extends React.Component {
  static propTypes = {
    login: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    tabSelect: PropTypes.func.isRequired,
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    errors: PropTypes.arrayOf(PropTypes.shape({
      message: PropTypes.string.isRequired,
    })),
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.login(this.props.email, this.props.password);
  }

  handleForgot = (e) => {
    e.preventDefault();
    this.props.tabSelect(3);
  }

  render() {
    const { email, password, errors, handleChange } = this.props;
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>Login</h1>
          {/*
          <p className={s.lead}>Log in with your Social Accounts or your Email Address.</p>
          <SocialLogin authText="Log in" />
          <strong className={s.lineThrough}>OR</strong>
          */}
          {errors && errors.map((item, index) => (
            <Alert key={index} bsStyle="danger" onDismiss={this.handleAlertDismiss}>
              <p>{item.message}</p>
            </Alert>
          ))}
          <Form method="post" onSubmit={this.handleSubmit}>
            <FormGroup>
              <ControlLabel>Email Address:</ControlLabel>
              <FormControl
                className={s.input}
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                autoFocus
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Password:</ControlLabel>
              <FormControl
                className={s.input}
                id="password"
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
              />
            </FormGroup>
            <Button className={s.button} type="submit">
              Log In
            </Button>
          </Form>
          <strong className={s.forgotLineThrough}>Forgot your password ?</strong>
          <Button className={s.button} type="submit" onClick={this.handleForgot}>
            Reset Password
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  errors: state.auth.errors,
});

export default connect(mapStateToProps, { login })(withStyles(s)(Login));
