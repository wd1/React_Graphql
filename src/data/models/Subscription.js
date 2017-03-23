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
import { baseUrl } from '../../config';

const Subscription = Model.define('Subscription', {

  email: {
    type: DataType.STRING(255),
    primaryKey: true,
    validate: { isEmail: true },
  },

  active: {
    type: DataType.BOOLEAN,
    defaultValue: true,
  },

  key: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    unique: true,
  },

  norooz96: {
    type: DataType.BOOLEAN,
    defaultValue: false,
  },

}, {

  getterMethods: {
    // note: don't use es6 functions here. It will mess `this` bind.
    unsubLink() { return `${baseUrl}/unsubscribe?key=${this.key}`; },
    hiddenEmail() {
      if (this.email) {
        const [user, domain] = this.email.split('@', 2);
        const hiddenEmail = `${user[0]}${Array(user.length - 1).join('*')}@${domain}`;
        return hiddenEmail;
      }
      return undefined;
    },
  },

  timestamps: true,

  updatedAt: true,

  indexes: [
    { fields: ['email', 'key'] },
  ],

});

export default Subscription;
