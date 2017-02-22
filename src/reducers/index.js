// -*- mode: react; -*-
import { combineReducers } from 'redux';
import auth from './auth';
import donate from './donate';

export default combineReducers({
  auth,
  donate,
});
