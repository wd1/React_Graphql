/**  -*- mode: react; -*-
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import bcrypt from 'bcrypt-nodejs';
import crypto from 'crypto';
import DataType from 'sequelize';
import Model from '../sequelize';

const User = Model.define('User', {

  id: {
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  email: {
    type: DataType.STRING(255),
    unique: true,
    validate: { isEmail: true },
    allowNull: false,
  },

  admin: {
    type: DataType.BOOLEAN,
    defaultValue: false,
  },

  emailConfirmed: {
    type: DataType.BOOLEAN,
    defaultValue: false,
  },

  password: {
    type: DataType.STRING(255),
    allowNull: false,
  },

  resetPasswordToken: {
    type: DataType.STRING(255),
  },

  resetPasswordExpires: {
    type: DataType.DATE,
  },

}, {

  timestamps: true,

  updatedAt: false,

  classMethods: {
    generateHash(password) {
      return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    },
    generateResetPasswordToken() {
      return crypto.randomBytes(20).toString('hex');
    },
  },

  instanceMethods: {
    comparePassword(password) {
      return bcrypt.compareSync(password, this.password);
    },
    isAdmin() {
      return this.admin;
    },
  },

  indexes: [
    { fields: ['email'] },
  ],

});

export default User;
