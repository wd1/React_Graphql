/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import { Grid,
         Tabs,
         Tab,
         Table,
         Glyphicon } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Admin.css';
import fetch from '../../core/fetch';

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }
  componentWillMount() {
    fetch('/graphql', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `{
          admin {
            subscriptions {
              email
              active
            }
            errors {
              key
              message
            }
          }
        }`,
      }),
      credentials: 'include',
    }).then((resp) => {
      resp.json().then((data) => {
        this.setState({ data: data.data.admin });
      });
    });
  }

  render() {
    if (!this.state.data) {
      return (
        <Grid style={{ minHeight: 500 }}>
          <h1>
            Loading...
          </h1>
        </Grid>
      );
    }
    return (
      <Grid style={{ minHeight: 500 }}>
        <Tabs defaultActiveKey={1} id="admin-tabs">
          <Tab eventKey={1} title="Subscriptions">
            <Table striped bordered condensed hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Email Address</th>
                  <th>Active</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.data.subscriptions.map((entry, index) => (
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
          <Tab eventKey={2} title="Donations">Donations</Tab>
        </Tabs>
      </Grid>
    );
  }
}

export default withStyles(s)(Admin);
