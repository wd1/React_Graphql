// -*- mode: react; -*-
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
  SIGNUP_REQUEST, SIGNUP_SUCCESS, SIGNUP_FAILURE,
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE,
  LOGOUT_REQUEST, LOGOUT_SUCCESS,
  FORGOT_REQUEST, FORGOT_SUCCESS, FORGOT_FAILURE,
  RESET_REQUEST, RESET_SUCCESS, RESET_FAILURE,
} from '../constants/auth';
import { auth } from '../config';
import history from '../core/history';

const maxAge = auth.jwt.expires;

/**
 * Sign up actions
 */
function signupRequest() {
  return {
    type: SIGNUP_REQUEST,
  };
}

function signupSuccess(id, token) {
  return {
    type: SIGNUP_SUCCESS,
    payload: {
      user: { id },
      token,
    },
  };
}

function signupFailure(errors) {
  return {
    type: SIGNUP_FAILURE,
    payload: {
      errors,
    },
  };
}

export function signup(email, password) {
  return async (dispatch, getState, { graphqlRequest }) => {
    dispatch(signupRequest());

    try {
      const { data } = await graphqlRequest(`
        mutation {
          signup(email: "${email}", password: "${password}") {
            data { user { id }, token }
            errors { key, message }
          }
        }
      `);

      const { data: { user, token }, errors } = data.signup;

      if (errors.length > 0) {
        dispatch(signupFailure(errors));
      } else {
        dispatch(signupSuccess(user.id, token));

        if (process.env.BROWSER) {
          document.cookie = `id_token=${token};path=/;max-age=${maxAge}`;
        }

        history.push('/profile');
      }
    } catch (e) {
      const errors = [
        {
          key: 'general',
          message: 'Unexpected server error',
        },
      ];
      dispatch(signupFailure(errors));
    }
  };
}

/**
 * Login actions
 */
function loginRequest() {
  return {
    type: LOGIN_REQUEST,
  };
}

function loginSuccess(id, token) {
  return {
    type: LOGIN_SUCCESS,
    payload: {
      user: { id },
      token,
    },
  };
}

function loginFailure(errors) {
  return {
    type: LOGIN_FAILURE,
    payload: {
      errors,
    },
  };
}

export function login(email, password) {
  return async (dispatch, getState, { graphqlRequest }) => {
    dispatch(loginRequest());

    try {
      const { data } = await graphqlRequest(`
        {
          login(email: "${email}", password: "${password}") {
            data { user { id }, token }
            errors { key, message }
          }
        }
      `);

      const { data: { user, token }, errors } = data.login;

      if (errors.length > 0) {
        dispatch(loginFailure(errors));
      } else {
        // this should be commented out as it cause a lot not useful logs
        dispatch(loginSuccess(user.id, token));

        if (process.env.BROWSER) {
          document.cookie = `id_token=${token};path=/;max-age=${maxAge}`;
        }

        history.push('/profile');
      }
    } catch (e) {
      const errors = [
        {
          key: 'general',
          message: 'Unexpected server error',
        },
      ];
      dispatch(loginFailure(errors));
    }
  };
}

/**
 * Logout actions
 */
function logoutRequest() {
  return {
    type: LOGOUT_REQUEST,
  };
}

function logoutSuccess() {
  return {
    type: LOGOUT_SUCCESS,
  };
}

export function logout() {
  return (dispatch) => {
    dispatch(logoutRequest());
    document.cookie = 'id_token=;path=/;max-age=-1';
    dispatch(logoutSuccess());
    history.push('/');
  };
}

function forgotRequest() {
  return {
    type: FORGOT_REQUEST,
  };
}

function forgotSuccess() {
  return {
    type: FORGOT_SUCCESS,
  };
}

function forgotFailure(errors) {
  return {
    type: FORGOT_FAILURE,
    payload: {
      errors,
    },
  };
}

export function forgot(email) {
  return async (dispatch, getState, { graphqlRequest }) => {
    dispatch(forgotRequest());

    try {
      const { data } = await graphqlRequest(`
        mutation {
          forgot(email: "${email}") {
            errors { key, message }
          }
        }
      `);

      const { errors } = data.forgot;

      if (errors.length > 0) {
        dispatch(forgotFailure(errors));
      } else {
        dispatch(forgotSuccess());
        history.push('/login');
      }
    } catch (e) {
      const errors = [
        {
          key: 'general',
          message: 'Unexpected server error',
        },
      ];
      dispatch(forgotFailure(errors));
    }
  };
}

function resetRequest() {
  return {
    type: RESET_REQUEST,
  };
}

function resetSuccess() {
  return {
    type: RESET_SUCCESS,
  };
}

function resetFailure(errors) {
  return {
    type: RESET_FAILURE,
    payload: {
      errors,
    },
  };
}

export function reset(token, password) {
  return async (dispatch, getState, { graphqlRequest }) => {
    dispatch(resetRequest());

    try {
      const { data } = await graphqlRequest(`
        mutation {
          reset(token: "${token}", password: "${password}") {
            errors { key, message }
          }
        }
      `);

      const { errors } = data.reset;

      if (errors.length > 0) {
        dispatch(resetFailure(errors));
      } else {
        dispatch(resetSuccess());
        history.push('/login');
      }
    } catch (e) {
      const errors = [
        {
          key: 'general',
          message: 'Unexpected server error',
        },
      ];
      dispatch(resetFailure(errors));
    }
  };
}
