/**  -*- mode: react; -*-
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

// Please refer to server.js for real initial state
// this only for redux doc compliance
const initialState = {
  isFetching: false,
  user: {},
  token: null,
};

export default function auth(state = initialState, action) {
  switch (action.type) {
    case SIGNUP_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case SIGNUP_SUCCESS:
      return {
        ...state,
        isFetching: false,
        user: action.payload.user,
        token: action.payload.token,
      };
    case SIGNUP_FAILURE:
      return {
        ...state,
        isFetching: false,
        errors: action.payload.errors,
      };

    case LOGIN_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isFetching: false,
        user: action.payload.user,
        token: action.payload.token,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        isFetching: false,
        errors: action.payload.errors,
      };

    case LOGOUT_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case LOGOUT_SUCCESS:
      return initialState;

    case FORGOT_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case FORGOT_SUCCESS:
      return {
        ...state,
        isFetching: false,
        errors: [],
      };
    case FORGOT_FAILURE:
      return {
        ...state,
        isFetching: false,
        errors: action.payload.errors,
      };

    case RESET_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case RESET_SUCCESS:
      return {
        ...state,
        isFetching: false,
        errors: [],
      };
    case RESET_FAILURE:
      return {
        ...state,
        isFetching: false,
        errors: action.payload.errors,
      };

    default:
      return state;
  }
}
