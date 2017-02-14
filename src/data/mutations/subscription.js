// -*- mode: react; -*-
import {
  GraphQLObjectType as ObjectType,
  GraphQLNonNull as NonNull,
  GraphQLString as StringType,
  GraphQLBoolean as BooleanType,
  GraphQLID as ID,
} from 'graphql';
import validator from 'validator';
import logger from '../../core/logger.js';
import ErrorType from '../types/ErrorType';
import { Subscription } from '../models';
import sendSubscriptionEmail from '../../email/Subscribe';

const resultType = new ObjectType({
  name: 'subscribtionResult',
  fields: {
    success: {
      type: BooleanType,
    },
    errors: {
      type: ErrorType,
    },
  },
});

const Errors = {
  // Subscription
  invalidEmail: {
    key: 'invalidEmail',
    message: 'Email address in invalid!',
  },

  // Unsubscription
  invalidKey: {
    key: 'invalidKey',
    message: 'Invalid unsubscription key!',
  },
};

const subscribe = {
  type: resultType,
  args: {
    email: { type: new NonNull(StringType) },
  },
  async resolve(root, { email }) {
    logger.info('subscribing new email:', email);
    const result = {
      success: true,
      errors: [],
    };

    if (!validator.isEmail(email)) {
      result.success = false;
      result.errors.push(Errors.invalidEmail);
      return result;
    }

    // TODO: this block can be replaced by an `upsert`. But not on sqlite:
    // read the note here: https://goo.gl/EnsVmr
    const [item] = await Subscription.findOrCreate({ where: { email } });
    if (!item.active) {
      // exists but deactivated
      // TODO: write a test for this
      item.update({ active: true });
    }

    // send an email
    sendSubscriptionEmail(item);
    return result;
  },
};

const unsubscribe = {
  type: resultType,
  args: {
    key: { type: new NonNull(ID) },
  },
  async resolve(root, { key }) {
    logger.info('unsubscribing key:', key);
    const result = {
      success: true,
      errors: [],
    };
    // count here returns all matching rows, even it is already inactive
    const [count] = await Subscription.update({ active: false }, { where: { key } });

    if (!count) {
      result.success = false;
      result.errors.push(Errors.invalidKey);
      return result;
    }

    return result;
  },
};

export default { subscribe, unsubscribe };
