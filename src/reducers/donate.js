/**  -*- mode: react; -*-
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
  DONATE_REQUEST, DONATE_SUCCESS, DONATE_FAILURE,
  CREATETOKEN_REQUEST, CREATETOKEN_SUCCESS, CREATETOKEN_FAILURE,
  SETPUBLISHABLEKEY_REQUEST, SETPUBLISHABLEKEY_SUCCESS, SETPUBLISHABLEKEY_FAILURE,
  RESET_SUCCESS,
} from '../constants/donate';

// Please refer to server.js for real initial state
// this only for redux doc compliance
const initialState = {
  isFetching: false,
  publishableKey: false,
  success: false,
  errors: [],
};

export default function donate(state = initialState, action) {
  switch (action.type) {
    case DONATE_REQUEST:
      return {
        ...state,
        isFetching: true,
        errors: [],
      };
    case DONATE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        success: true,
        errors: [],
      };
    case DONATE_FAILURE:
      return {
        ...state,
        isFetching: false,
        errors: action.payload.errors,
      };

    case CREATETOKEN_REQUEST:
      return {
        ...state,
        isFetching: true,
        errors: [],
      };
    case CREATETOKEN_SUCCESS:
      return {
        ...state,
        isFetching: false,
        token: action.payload.token,
        contact: action.payload.contact,
        errors: [],
      };
    case CREATETOKEN_FAILURE:
      return {
        ...state,
        isFetching: false,
        errors: action.payload.errors,
      };

    case SETPUBLISHABLEKEY_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case SETPUBLISHABLEKEY_SUCCESS:
      return {
        ...state,
        isFetching: false,
        publishableKey: true,
        errors: [],
      };
    case SETPUBLISHABLEKEY_FAILURE:
      return {
        ...state,
        isFetching: false,
        errors: action.payload.errors,
      };

    case RESET_SUCCESS:
      return {
        ...state,
        isFetching: false,
        publishableKey: true,
        errors: [],
        success: false,
        token: null,
      };

    default:
      return state;
  }
}
