/**   -*- mode: react; -*-
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import { Grid,
         Row,
         Alert } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Profile.css';

class Profile extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    me: PropTypes.shape({
      email: PropTypes.string.isRequired,
    }).isRequired,
  };

  render() {
    return (
      <Grid style={{ marginBottom: 200 }}>
        <Row>
          <Alert bsStyle="danger">
            <h4>
              This page is under construction!
            </h4>
          </Alert>
        </Row>
      </Grid>
    );
  }
}

export default withStyles(s)(Profile);
