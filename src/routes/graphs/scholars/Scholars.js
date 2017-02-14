import React, {
  PropTypes,
} from 'react';
import {
  Grid,
  Row,
} from 'react-bootstrap';
import { DrawGraph } from './d3-code';
import { Disclaimer } from '../GraphsData';

class Scholars extends React.Component {
  static propTypes = {
    title: PropTypes.string,
  };

  componentDidMount() {
    DrawGraph();
  };


  render() {
    return (
      <Grid>
        <h1>Iranian-American Scholars</h1>

        {/* !-- Map -- */}
        <h2>By Location</h2>
        <div id="scholars-map" />
        <p>
          The size of bubbles represent population of Iranian-Americans in each school.
          <br />
          The darkness of each bubble represents the percentage of Iranian-Americans in each school.
        </p>

        {/* !-- Citations -- */}
        <h2>By Citations</h2>
        <h4>Estimated Total Number of Citations: <span id="cite-total" /></h4>
        <h4>Estimated Average Citations: <span id="cite-avg" /></h4>
        <div id="scholars-citations" />


        {/* !-- Gender -- */}
        <h2>By Gender</h2>
        <div id="scholars-gender" />


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

export default Scholars;
