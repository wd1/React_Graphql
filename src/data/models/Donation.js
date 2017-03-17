/**  -*- mode: react; -*-
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import DataType from 'sequelize';
import Model from '../sequelize';
import { DONATE_NEW, DONATE_COMPLETED, DONATE_CANCELED } from '../../constants/donate';

const Donation = Model.define('Donation', {

  id: {
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  userId: {
    type: DataType.INTEGER,
    allowNull: true,
    // allow anonymous donations
  },

  amount: {
    type: DataType.INTEGER,
    allowNull: false,
  },

  token: {
    type: DataType.STRING(255),
    allowNull: false,
  },

  email: {
    type: DataType.STRING(255),
    validate: { isEmail: true },
    allowNull: false,
  },

  fullName: {
    type: DataType.STRING(255),
    allowNull: false,
  },

  zipCode: {
    type: DataType.STRING(120),
    allowNull: false,
  },

  last4: {
    type: DataType.INTEGER,
    allowNull: true,
  },

  exp_month: {
    type: DataType.INTEGER,
    allowNull: true,
  },

  exp_year: {
    type: DataType.INTEGER,
    allowNull: true,
  },

  brand: {
    type: DataType.STRING(120),
    allowNull: true,
  },

  country: {
    type: DataType.STRING(120),
    allowNull: true,
  },

  status: {
    type: DataType.ENUM(DONATE_NEW, DONATE_CANCELED, DONATE_COMPLETED),
    defaultValue: DONATE_NEW,
  },

  announceAmount: {
    type: DataType.BOOLEAN,
    defaultValue: false,
  },

  announceName: {
    type: DataType.BOOLEAN,
    defaultValue: false,
  },

}, {

  timestamps: true,

  // this is not a unique index, i'm not sure how much it's helping
  indexes: [
    { fields: ['email'] },
  ],
});

export default Donation;
