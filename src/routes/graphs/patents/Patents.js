import React, {
  PropTypes,
} from 'react';
import {
  Grid,
  Row,
  Col,
  Jumbotron,
} from 'react-bootstrap';
import { DrawGraph } from './d3-code';
import { Disclaimer } from '../GraphsData';

class Patents extends React.Component {
  static propTypes = {
    title: PropTypes.string,
  };

  componentDidMount() {
    DrawGraph();
  }


  render() {
    return (
      <Grid>
        <h1>Iranian-American Patent Holders</h1>
        <p>
          There are around
          {' '}<span style={{ fontWeight: 'bold' }} id="count" />{' '}
          patents with at least one Iranian-American contributer.
        </p>

        {/* !-- Map -- */}
        <h2>Where Patent Holders Live:</h2>
        <div id="map" />

        {/* !-- Year -- */}
        <h2>Patents By Year</h2>
        <Row>
          <Col md={6}>
            <div id="year" />
          </Col>
          <Col md={6}>
            <div id="year-percentage" />
          </Col>
        </Row>

        {/* !-- Status -- */}
        <h2>Patents Status</h2>
        <div id="status" />


        {/* !-- Gender -- */}
        <h2>By Gender</h2>
        <Row>
          <Col sm={6}>
            <Jumbotron className="text-center">
              <h2>Coming Soon!</h2>
            </Jumbotron>
          </Col>
        </Row>
        <div id="gender" />

        {/* !-- Classification -- */}
        <h2>By Patent Category</h2>
        <Row>
          <Col sm={6}>
            <Jumbotron className="text-center">
              <h2>Coming Soon!</h2>
            </Jumbotron>
          </Col>
        </Row>
        <div id="classification" />

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

export default Patents;
