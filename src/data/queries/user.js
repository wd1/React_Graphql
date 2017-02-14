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

const login = {
  type: new ObjectType({
    name: 'loginResult',
    fields: {
      data: {
        type: new ObjectType({
          name: 'loginResultData',
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
    let token = null;
    const errors = [];

    const emailLc = email.toLowerCase();
    const user = await User.findOne({
      where: { email: emailLc },
    });

    if (user && user.comparePassword(password)) {
      token = jwt.sign({ id: user.id }, authSecret.jwt.secret, { expiresIn: auth.jwt.expires });
    } else {
      errors.push({ key: 'general', message: 'Invalid credentials' });
    }

    const data = {
      user,
      token,
    };

    return {
      data,
      errors,
    };
  },
};

const me = {
  type: UserType,
  resolve({ request }) {
    return User.findById(request.body.id);
  },
};

export default { login, me };
