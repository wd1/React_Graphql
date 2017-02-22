// -*- mode: react; -*-
import {
  GraphQLObjectType as ObjectType,
  GraphQLNonNull as NonNull,
  GraphQLString as StringType,
} from 'graphql';
import jwt from 'jsonwebtoken';
import UserType from '../types/UserType';
import ErrorType from '../types/ErrorType';
import { User } from '../models';
import { auth } from '../../config';
import { auth as authSecret } from '../../secrets';
import logger from '../../core/logger.js';
import sendRegistrationEmail from '../../email/Registration';
import sendForgotEmail from '../../email/Forgot';
import sendResetEmail from '../../email/Reset';

const signup = {
  type: new ObjectType({
    name: 'signupResult',
    fields: {
      data: {
        type: new ObjectType({
          name: 'signupResultData',
          fields: {
            user: {
              type: UserType,
            },
            token: {
              type: StringType,
            },
          },
        }),
      },
      errors: {
        type: ErrorType,
      },
    },
  }),
  args: {
    email: { type: new NonNull(StringType) },
    password: { type: new NonNull(StringType) },
  },
  async resolve(root, { email, password }) {
    let user = null;
    let token = null;
    const errors = [];

    if (password.length < 8) {
      errors.push({ key: 'password', message: 'Password must be at least 8 characters long' });
    }

    // check to see if there's already a user with that email
    const count = await User.count({ where: { email } });

    if (count > 0) {
      errors.push({ key: 'email', message: 'User with this email already exists' });
    }

    if (errors.length === 0) {
      user = await User.create({
        email: email.toLowerCase(),
        password: User.generateHash(password),
      });

      token = jwt.sign({ id: user.id }, authSecret.jwt.secret, { expiresIn: auth.jwt.expires });

      user = await User.findOne({
        where: { email },
      });
    }

    const data = {
      user,
      token,
    };

    if (errors.length > 0) {
      logger.error('Registration failed', { email, errors });
    } else {
      await sendRegistrationEmail(email);
      logger.info('Registration Succeed', { email });
    }

    return {
      data,
      errors,
    };
  },
};

const forgot = {
  type: new ObjectType({
    name: 'forgotResult',
    fields: {
      errors: {
        type: ErrorType,
      },
    },
  }),
  args: {
    email: { type: new NonNull(StringType) },
  },
  async resolve(root, { email }) {
    let resetPasswordToken = null;
    const errors = [];

    // check to see if there's already a user with that email
    const emailLc = email.toLowerCase();
    const user = await User.findOne({ where: { email: emailLc } });

    if (!user) {
      errors.push({ key: 'email', message: 'There\'s no user with such email exists' });
    }

    if (errors.length === 0) {
      resetPasswordToken = User.generateResetPasswordToken();
      user.resetPasswordToken = resetPasswordToken;
      user.resetPasswordExpires = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
      await user.save();
      await sendForgotEmail(email, resetPasswordToken);
    }

    if (errors.length > 0) {
      logger.error('Generating reset token failed', { email, errors });
    } else {
      /* sendRegistrationEmail(email);*/
      logger.info('Successfully Generated reset token', { email });
    }

    return {
      errors,
    };
  },
};

const reset = {
  type: new ObjectType({
    name: 'resetResult',
    fields: {
      errors: {
        type: ErrorType,
      },
    },
  }),
  args: {
    token: { type: new NonNull(StringType) },
    password: { type: new NonNull(StringType) },
  },
  async resolve(root, { token, password }) {
    const errors = [];
    const resetPasswordToken = token;

    if (password.length < 8) {
      errors.push({ key: 'password', message: 'Password must be at least 8 characters long' });
    }

    // check to see if there's already a user with that email
    const user = await User.findOne({ where: { $and: { resetPasswordToken, resetPasswordExpires: { $gt: Date.now() } } } });

    if (!user) {
      errors.push({ key: 'email', message: 'Password reset token is invalid or has expired.' });
    }

    if (errors.length === 0) {
      const email = user.email;
      user.password = User.generateHash(password);
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();
      await sendResetEmail(email, resetPasswordToken);
    }

    if (errors.length > 0) {
      logger.error('Fail attempt to reset password', { token, errors });
    } else {
      /* sendRegistrationEmail(email);*/
      logger.info('Password Successfully reset', { email: user.email });
    }

    return {
      errors,
    };
  },
};

export default { signup, forgot, reset };
