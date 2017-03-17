import React, {
  PropTypes,
} from 'react';
import {
  Grid,
  Row,
  Col,
} from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Healthcare.css';
import DrawGraph from './d3-code';
import { Disclaimer } from '../GraphsData';

class Healthcare extends React.Component {
  static propTypes = {
    category: PropTypes.string.isRequired,
    graphs: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  componentDidMount() {
    DrawGraph(this.props.category);
  }


  render() {
    return (
      <Grid>
        <h1 style={{ textTransform: 'capitalize' }}>
          Iranian American {this.props.category}
        </h1>
        <p>
          There are around
          {' '}<span style={{ fontWeight: 'bold' }} id="count" /> (est.)
          Iranian American {this.props.category}.
        </p>


        {/* !-- Map -- */}
        <h2>By Location</h2>
        <Row id="mapRow">
          <div id="tooltip-container" />
          <div id="map" />
          <div className="mapText">
            <h4 id="mapText1" />
            <h4 id="mapText2" />
          </div>

        </Row>

        <Row>
          <Col md={6}>

            {/* !-- Gender -- */}
            <h2>By Gender</h2>
            <div id="gender" />

          </Col>
          {this.props.graphs.indexOf('type') !== -1 &&
            <Col md={6}>
              {/* !-- Type -- */}
              <h2>By Type</h2>
              <div id="type" />
            </Col>
          }
        </Row>

        {/* !-- Classification -- */}
        {this.props.graphs.indexOf('classification') !== -1 &&
          <div>
            <h2>By Classification</h2>
            <div id="classification" />
          </div>
        }


        {/* !-- Specialization -- */}
        {this.props.graphs.indexOf('specialization') !== -1 &&
          <div>
            <h2>By Specialization</h2>
            <p id="specialization-note" />
            <div id="specialization" />
          </div>
        }

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

export default withStyles(s)(Healthcare);
