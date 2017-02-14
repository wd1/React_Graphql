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
import { reset } from '../../../actions/auth';
import s from './Reset.css';

class Reset extends React.Component {
  static propTypes = {
    handleChange: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    token: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    confirmpassword: PropTypes.string.isRequired,
    errors: PropTypes.arrayOf(PropTypes.shape({
      message: PropTypes.string.isRequired,
    })),
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.reset(this.props.token, this.props.password);
  };

  render() {
    const { errors, handleChange, password, confirmpassword } = this.props;
    let passwordValidation;
    let confirmpasswordValidation;

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
          <h1>Reset Your Password</h1>
          <p className={s.lead}>Reset your password from form below</p>
          {errors && errors.length === 0 &&
            <Alert bsStyle="success" onDismiss={this.handleAlertDismiss}>
              <p>Your password has been successfully changed.</p>
            </Alert>
          }
          {errors && errors.map((item, index) => (
            <Alert key={index} bsStyle="danger" onDismiss={this.handleAlertDismiss}>
              <p>{item.message}</p>
            </Alert>
          ))}
          <Form method="post" onSubmit={this.handleSubmit}>
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
              Reset Password
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

export default connect(mapStateToProps, { reset })(withStyles(s)(Reset));
