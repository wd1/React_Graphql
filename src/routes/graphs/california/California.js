import React, {
  PropTypes,
} from 'react';
import {
  Grid,
  Row,
} from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './California.css';
import { DrawGraph } from './d3-code';
import { Disclaimer } from '../GraphsData';

class Content extends React.Component {
  static propTypes = {
    title: PropTypes.string,
  };

  componentDidMount() {
    DrawGraph.bind(this)();
  }

  render() {
    const explanation = {
      visibility: 'hidden',
    };
    return (
      <Grid>
        <h1>Iranian-Americans Contributions in California Government</h1>
        <Row>
          <div ref={(input) => (this.sequence = input)} id="sequence" />

          <div ref={(input) => (this.doughnut = input)} id="doughnut">
            <div id="chart">
              <div id="explanation" style={explanation} ref={(input) => (this.explanation = input)}>
                <span id="center-name" /><br />
                <span id="center-ia" />
                <br />
                Iranian-American records out of
                <br />
                <span id="center-total" />
                <br />
                total records
              </div>
            </div>
          </div>
          <div ref={(input) => (this.map = input)} id="map" />
        </Row>

        <Row style={{ paddingTop: 50 }}>
          <p>
            Last update: 11/15/2016.
          </p>

          <Disclaimer />
        </Row>
      </Grid>
    );
  }
}

export default withStyles(s)(Content);
