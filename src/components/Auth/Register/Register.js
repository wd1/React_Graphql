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
import { signup } from '../../../actions/auth';
import SocialLogin from '../SocialLogin';
import s from './Register.css';

class Register extends React.Component {
  static propTypes = {
    signup: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    confirmpassword: PropTypes.string.isRequired,
    errors: PropTypes.arrayOf(PropTypes.shape({
      message: PropTypes.string.isRequired,
    })),
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.props.confirmpassword === this.props.password) {
      this.props.signup(this.props.email, this.props.password);
    } else {
      this.setState({ errors: [...this.props.errors, 'Wrong Password Confirmation'] });
    }
  }

  render() {
    const { errors, handleChange, email, password, confirmpassword } = this.props;
    let passwordValidation;
    let confirmpasswordValidation;
    let emailValidation;

    if (password.length === 0) {
      passwordValidation = null;
    } else if (password.length < 8) {
      passwordValidation = 'error';
    } else {
      passwordValidation = 'success';
    }

    if (confirmpassword.length === 0) {
      confirmpasswordValidation = null;
    } else if (confirmpassword === password) {
      confirmpasswordValidation = 'success';
    } else {
      confirmpasswordValidation = 'error';
    }

    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>Register</h1>
          {/*
          <p className={s.lead}>
            Register with your email or Login with one of your social accounts
          </p>
          <SocialLogin authText="Sign Up" />
          <strong className={s.lineThrough}>OR</strong>
          */}
          {errors && errors.map((item, index) => (
            <Alert key={index} bsStyle="danger" onDismiss={this.handleAlertDismiss}>
              <p>{item.message}</p>
            </Alert>
          ))}
          <Form method="post" onSubmit={this.handleSubmit}>
            <FormGroup validationState={emailValidation} >
              <ControlLabel>Email Address:</ControlLabel>
              <FormControl
                className={s.input}
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup validationState={passwordValidation}>
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
            <FormGroup validationState={confirmpasswordValidation}>
              <ControlLabel>Confirm Password:</ControlLabel>
              <FormControl
                className={s.input}
                id="confirmpassword"
                type="password"
                name="confirmpassword"
                value={confirmpassword}
                onChange={handleChange}
              />
            </FormGroup>
            <Button className={s.button} type="submit">
              Register
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  errors: state.auth.errors,
});

export default connect(mapStateToProps, { signup })(withStyles(s)(Register));
