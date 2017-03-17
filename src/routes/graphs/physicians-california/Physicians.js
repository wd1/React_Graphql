import React, {
  PropTypes,
} from 'react';
import {
  Grid,
  Row,
  Col,
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
        <h1>Iranian American Physicians in California</h1>
        <p>
          There are around
          {' '}<span style={{ fontWeight: 'bold' }} id="count" /> (est.)
          Iranian American physicians registered in California.
        </p>

        <Row>
          <div id="tooltip-container" />
          <Col md={6}>
            {/* !-- Map -- */}
            <h2>By Location</h2>
            <div id="map" />
          </Col>
          <Col md={6}>
            {/* !-- Status -- */}
            <h2>By Gender</h2>
            <div id="gender" />
          </Col>
        </Row>


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
