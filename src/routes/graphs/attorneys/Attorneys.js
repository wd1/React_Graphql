import React, {
  PropTypes,
} from 'react';
import {
  Grid,
  Row,
  Col,
} from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Attorneys.css';
import { DrawGraph } from './d3-code';
import { Disclaimer } from '../GraphsData';

class Attorneys extends React.Component {
  static propTypes = {
    title: PropTypes.string,
  };

  componentDidMount() {
    DrawGraph();
  }

  render() {
    return (
      <Grid>
        <h1>Iranian American Attorneys in California</h1>
        <p>
          There are around
          {' '}<span style={{ fontWeight: 'bold' }} id="count" /> (est.)
          Iranian American attorneys registered in the State BAR of California.
        </p>

        <div id="tooltip-container" />
        <Row>
          <Col md={6}>
            {/* !-- Map -- */}
            <h2>By Location</h2>
            <div id="map" />
          </Col>
          <Col md={6}>
            {/* !-- Status -- */}
            <h2>By Latest Status</h2>
            <div id="status" />
          </Col>
        </Row>


        {/* !-- Date -- */}
        <h2>By Admission Year</h2>
        <Row>
          <Col md={6}>
            <div id="admission-year" />
          </Col>
          <Col md={6}>
            <div id="admission-year-percentage" />
          </Col>
        </Row>

        {/* !-- Gender -- */}
        <h2>By Gender</h2>
        <div id="gender" />

        {/* !-- Law School -- */}
        <h2>By Law School Attended</h2>
        <div id="law-school" />

        {/* !-- Undergrad School -- */}
        <h2>By Undergraduate School Attended</h2>
        <div id="undergrad-school" />

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

export default withStyles(s)(Attorneys);
