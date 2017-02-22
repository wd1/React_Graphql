import React, { PropTypes } from 'react';
import { Grid } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Loading.css';

class Loading extends React.Component {
  static propTypes = {
    children: PropTypes.element,
  }

  render() {
    return (
      <Grid className={s.loading}>
        <h1>
          Loading...
        </h1>
        {this.props.children}
      </Grid>
    );
  }
}

export default withStyles(s)(Loading);
