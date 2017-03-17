// -*- mode: react; -*-
import {
  GraphQLObjectType as ObjectType,
} from 'graphql';
import { Donation } from '../models';
import ErrorType from '../types/ErrorType';
import DonationType from '../types/DonationType';

const myDonations = {
  type: new ObjectType({
    name: 'donationData',
    fields: {
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
    let donations = [];
    try {
      // #TODO make sure request.user is ready
      if (!request.user) {
        return { donations, errors };
      }
      const userId = request.user.id;
      donations = await Donation.findAll({
        where: { userId },
        order: '"updatedAt" DESC',
      });

      return { donations, errors };
    } catch (e) {
      errors.push({
        key: 'general',
        message: 'Unexpected Server Error',
        /* message: e.message,*/
      });
      return { errors };
    }
  },
};

export default { myDonations };
