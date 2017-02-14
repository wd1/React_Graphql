// IMPORTANT, this is a workaround for now
// We have to add better structure for our migrations

import DataType from 'sequelize';
import sequelize from '../../sequelize';

const queryInterface = sequelize.getQueryInterface();

queryInterface.removeIndex('User', 'username');
queryInterface.removeColumn('User', 'username');

queryInterface.addColumn(
  'User',
  'admin',
  {
    type: DataType.BOOLEAN,
    defaultValue: false,
  },
);

queryInterface.addColumn(
  'User',
  'resetPasswordToken',
  {
    type: DataType.STRING(255),
  },
);

queryInterface.addColumn(
  'User',
  'resetPasswordExpires',
  {
    type: DataType.DATE,
  },
);
