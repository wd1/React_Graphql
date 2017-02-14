// -*- mode: react; -*-
import {
  GraphQLList as List,
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLBoolean as BooleanType,
} from 'graphql';
import { User, Subscription } from '../models';
import ErrorType from '../types/ErrorType';

const admin = {
  type: new ObjectType({
    name: 'adminData',
    fields: {
      subscriptions: {
        type: new List(new ObjectType({
          name: 'subscriptions',
          fields: {
            email: { type: StringType },
            active: { type: BooleanType },
          },
        })),
      },
      /* donations: {
        type: StringType,
      }, */
      errors: {
        type: ErrorType,
      },
    },
  }),
  args: {
  },
  async resolve({ request }) {
    const errors = [];
    const user = await User.findById(request.user.id);
    if (!user.admin) {
      errors.push({
        key: 'unauthorized',
        message: 'unauthorized access!',
      });
      return {
        errors,
      };
    }
    const subscriptions = Subscription.findAll({ attributes: ['email', 'active'] });
    // const donations = Donation.findAll({ attributes: ['email', 'active'] });
    return { subscriptions, errors };
  },
};

export default { admin };
