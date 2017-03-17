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
         Table } from 'react-bootstrap';
import Moment from 'moment';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Alerts from '../../components/Alerts';
import Loading from '../../components/Loading';
import s from './Admin.css';
import { DONATE_COMPLETED } from '../../constants/donate';
import NullableBool from '../../components/Misc/NullableBool';

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
                      <td><NullableBool value={entry.active} /></td>
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
                  <th>Last 4 Digits</th>
                  <th>Expire Date</th>
                  <th>Brand</th>
                  <th>Country</th>
                  <th>Status</th>
                  <th>Ann. Amount</th>
                  <th>Ann. Name</th>
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
                    <td>{entry.last4}</td>
                    <td>{entry.exp_month}/{entry.exp_year}</td>
                    <td>{entry.brand}</td>
                    <td>{entry.country}</td>
                    <td><NullableBool value={entry.status === DONATE_COMPLETED} /></td>
                    <td><NullableBool value={entry.announceAmount} /></td>
                    <td><NullableBool value={entry.announceName} /></td>
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
