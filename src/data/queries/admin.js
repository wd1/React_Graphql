// -*- mode: react; -*-
import {
  GraphQLList as List,
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLBoolean as BooleanType,
} from 'graphql';
import { User, Subscription, Donation } from '../models';
import ErrorType from '../types/ErrorType';
import DonationType from '../types/DonationType';

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
      donations: {
        type: DonationType,
      },
      errors: {
        type: ErrorType,
      },
    },
  }),
  args: {
  },
  async resolve({ request }) {
    const errors = [];
    try {
      // this is a duplicate query from server which is required due security reasons
      // we can not rely on data from store and redux state
      const user = await User.findById(request.user.id);
      if (!user.isAdmin()) {
        errors.push({
          key: 'unauthorized',
          message: 'unauthorized access!',
        });
        return {
          errors,
        };
      }
      const subscriptions = await Subscription.findAll({ attributes: ['email', 'active'] });
      if (subscriptions && subscriptions.length === 0) {
        errors.push({
          key: 'subscriptions',
          message: 'There\'s no subscriptions on database yet',
        });
      }

      const donations = await Donation.findAll({ order: '"updatedAt" DESC' });
      if (donations && donations.length === 0) {
        errors.push({
          key: 'donations',
          message: 'There\'s no donation on database yet',
        });
      }

      return { donations, subscriptions, errors };
    } catch (e) {
      errors.push({
        key: 'general',
        message: 'Unexpected Server Error',
      });
      return { errors };
    }
  },
};

export default { admin };
