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
import { forgot } from '../../../actions/auth';
import s from './Forgot.css';

class Forgot extends React.Component {
  static propTypes = {
    email: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired,
    forgot: PropTypes.func.isRequired,
    errors: PropTypes.arrayOf(PropTypes.shape({
      message: PropTypes.string.isRequired,
    })),
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.forgot(this.props.email);
  };

  render() {
    const { errors, email, handleChange } = this.props;
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>Forgot Your Password?</h1>
          <p className={s.lead}>Enter your email address below and we will send you an email with a link so that you can reset your password.</p>
          {errors && errors.length === 0 &&
            <Alert bsStyle="success" onDismiss={this.handleAlertDismiss}>
              <p>An email containing instructions to reset your password has been sent.</p>
            </Alert>
          }
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

export default connect(mapStateToProps, { forgot })(withStyles(s)(Forgot));
