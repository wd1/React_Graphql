// IMPORTANT, this is a workaround for now
// We have to add better structure for our migrations

import DataType from 'sequelize';
import sequelize from '../../sequelize';

const queryInterface = sequelize.getQueryInterface();

queryInterface.addColumn(
  'Donation',
  'last4',
  {
    type: DataType.INTEGER,
  },
);

queryInterface.addColumn(
  'Donation',
  'exp_month',
  {
    type: DataType.INTEGER,
  },
);

queryInterface.addColumn(
  'Donation',
  'exp_year',
  {
    type: DataType.INTEGER,
  },
);

queryInterface.addColumn(
  'Donation',
  'brand',
  {
    type: DataType.STRING(120),
  },
);

queryInterface.addColumn(
  'Donation',
  'country',
  {
    type: DataType.STRING(120),
  },
);

queryInterface.addColumn(
  'Donation',
  'announceName',
  {
    type: DataType.BOOLEAN,
  },
);

queryInterface.addColumn(
  'Donation',
  'announceAmount',
  {
    type: DataType.BOOLEAN,
  },
);
