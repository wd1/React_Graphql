import React, { PropTypes } from 'react';
import {
  Alert,
} from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Alerts.css';

class Alerts extends React.Component {
  static propTypes = {
    errors: PropTypes.arrayOf(PropTypes.shape({
      message: PropTypes.string.isRequired,
    })),
  }
  render() {
    const { errors } = this.props;
    return (
      <div className={s.container}>
        {errors && errors.map((item, index) => (
          <Alert key={index} bsStyle="danger" onDismiss={this.handleAlertDismiss}>
            <p>{item.message}</p>
          </Alert>
         ))}
      </div>
    );
  }
}

export default withStyles(s)(Alerts);
