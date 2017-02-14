// -*- mode: react; -*-
import {
  GraphQLObjectType as ObjectType,
  GraphQLNonNull as NonNull,
  GraphQLString as StringType,
  GraphQLID as ID,
} from 'graphql';
import ErrorType from '../types/ErrorType';
import { Subscription } from '../models';

const Errors = {
  // unsubData
  noResults: {
    key: 'noResults',
    message: 'We couldn\'t find your subscription in our database!',
  },
};

const unsubData = {
  type: new ObjectType({
    name: 'unsubDataResult',
    fields: {
      email: {
        type: StringType,
      },
      errors: {
        type: ErrorType,
      },
    },
  }),
  args: {
    key: { type: new NonNull(ID) },
  },
  async resolve(root, { key }) {
    const result = {
      email: undefined,
      errors: [],
    };

    const item = await Subscription.findOne({ where: { key, active: true } });
    if (!item) {
      result.errors.push(Errors.noResults);
      return result;
    }
    result.email = item.hiddenEmail;

    return result;
  },
};

export default { unsubData };
