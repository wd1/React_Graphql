// IMPORTANT, this is a workaround for now
// We have to add better structure for our migrations

import DataType from 'sequelize';
import sequelize from '../../sequelize';

const queryInterface = sequelize.getQueryInterface();

queryInterface.addColumn(
  'Subscription',
  'norooz96',
  {
    type: DataType.BOOLEAN,
    defaultValue: false,
  },
);
