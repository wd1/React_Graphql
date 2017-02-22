import React, {
  PropTypes,
} from 'react';
import {
  Grid,
  Row,
} from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Physicians.css';
import DrawGraph from './d3-code';
import { Disclaimer } from '../GraphsData';

class Physicians extends React.Component {
  static propTypes = {
    title: PropTypes.string,
  };

  componentDidMount() {
    DrawGraph();
  }


  render() {
    return (
      <Grid>
        <h1>Iranian-American Physicians</h1>
        <p>
          There are around
          {' '}<span style={{ fontWeight: 'bold' }} id="count" /> (est.)
          Iranian-American physicians.
        </p>


        {/* !-- Map -- */}
        <h2>By Location</h2>
        <div>
          <div id="tooltip-container" />
          <div id="map" />
          <h4 id="mapText" />
        </div>

        <h2>By Location 2 (test)</h2>
        <div>
          <div id="tooltip-container" />
          <div id="map2" />
        </div>

        {/* !-- Type -- */}
        <h2>By Type</h2>
        <div id="type" />


        {/* !-- Classification -- */}
        <h2>By Classification</h2>
        <div id="classification" />


        {/* !-- Specialization -- */}
        <h2>By Specialization</h2>
        <p id="specialization-note" />
        <div id="specialization" />

        {/* !-- Status -- */}
        <h2>By Gender</h2>
        <div id="gender" />

        <Row style={{ paddingTop: 50 }}>
          <p>
            Last update: <span id="last-update" />.
          </p>

          <Disclaimer />
        </Row>

      </Grid>
    );
  }
}

export default withStyles(s)(Physicians);
