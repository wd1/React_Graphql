/**   -*- mode: react; -*-
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import {
  Grid,
  Tabs,
  Tab,
  Table,
} from 'react-bootstrap';
import Moment from 'moment';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Profile.css';
import Loading from '../../components/Loading';
import Alerts from '../../components/Alerts';
import { DONATE_COMPLETED } from '../../constants/donate';
import NullableBool from '../../components/Misc/NullableBool';

class Profile extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    donation: PropTypes.object,
  };

  render() {
    const { donation } = this.props;
    const { donations, errors } = donation;

    if (donations && donations.length === 0) {
      return (
        <Loading />
      );
    }
    if (errors && errors.length > 0) {
      return (
        <Alerts errors={errors} />
      );
    }
    return (
      <Grid style={{ minHeight: 500 }}>
        <Tabs defaultActiveKey={1} id="admin-tabs">
          <Tab eventKey={1} title="Donations">
            <Table striped bordered condensed hover responsive className={s.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Amount</th>
                  <th>Last 4 Digits</th>
                  <th>Expire Date</th>
                  <th>Announce Name</th>
                  <th>Announce Amount</th>
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
                      <td>{entry.last4}</td>
                      <td>{entry.exp_month}/{entry.exp_year}</td>
                      <td><NullableBool value={entry.announceName} /></td>
                      <td><NullableBool value={entry.announceAmount} /></td>
                      <td><NullableBool value={entry.status === DONATE_COMPLETED} /></td>
                      <td>{Moment(entry.updatedAt).fromNow()}</td>
                    </tr>
                  ))
                }
              </tbody>
            </Table>
          </Tab>
          {/* <Tab eventKey={1} title="Profile"> */}
        </Tabs>
      </Grid>
    );
  }
}

export default withStyles(s)(Profile);
