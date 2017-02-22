/**  -*- mode: react; -*-
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import { Grid,
         Tabs,
         Tab,
         Table,
         Glyphicon } from 'react-bootstrap';
import Moment from 'moment';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Alerts from '../../components/Alerts';
import Loading from '../../components/Loading';
import s from './Admin.css';
import { DONATE_COMPLETED } from '../../constants/donate';

class Admin extends React.Component {
  static propTypes = {
    // fix it to shape
    admin: PropTypes.shape({
      errors: PropTypes.array,
      subscriptions: PropTypes.array,
      donations: PropTypes.array,
    }),
  }

  render() {
    const { admin } = this.props;
    if (!admin) {
      return (
        <Loading />
      );
    }
    const { errors, subscriptions, donations } = admin;

    if (errors && errors.length > 0) {
      return (
        <Alerts errors={errors} />
      );
    }
    return (
      <Grid style={{ minHeight: 500 }}>
        <Tabs defaultActiveKey={1} id="admin-tabs">
          <Tab eventKey={1} title="Subscriptions">
            <Table striped bordered condensed hover responsive className={s.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Email Address</th>
                  <th>Active</th>
                </tr>
              </thead>
              <tbody>
                {
                  subscriptions.map((entry, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{entry.email}</td>
                      <td>
                        {
                          entry.active
                          ?
                            <div><Glyphicon glyph="ok" style={{ color: 'green' }} /></div>
                          :
                            <div><Glyphicon glyph="remove" style={{ color: 'red' }} /></div>
                        }
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </Table>
          </Tab>
          <Tab eventKey={2} title="Donations">
            <Table striped bordered condensed hover responsive className={s.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Amount</th>
                  <th>Email Address</th>
                  <th>Full Name</th>
                  <th>Zip Code</th>
                  <th>Status</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {
                donations.map((entry, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{entry.amount}</td>
                    <td>{entry.email}</td>
                    <td>{entry.fullName}</td>
                    <td>{entry.zipCode}</td>
                    <td>
                      {
                        (entry.status === DONATE_COMPLETED)
                        ?
                          <div><Glyphicon glyph="ok" style={{ color: 'green' }} /></div>
                        :
                          <div><Glyphicon glyph="remove" style={{ color: 'red' }} /></div>
                      }
                    </td>
                    <td>{Moment(entry.updatedAt).fromNow()}</td>
                  </tr>
                  ))
                }
              </tbody>
            </Table>
          </Tab>
        </Tabs>
      </Grid>
    );
  }
}

export default withStyles(s)(Admin);
