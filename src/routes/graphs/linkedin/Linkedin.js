import React, {
  PropTypes,
} from 'react';
import {
  Grid,
  Row,
  Col,
} from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Linkedin.css';
import { DrawGraph } from './d3-code';
import { Disclaimer } from '../GraphsData';

class Content extends React.Component {
  static propTypes = {
    title: PropTypes.string,
  };

  componentDidMount = () => {
    DrawGraph.bind(this)();
  };

  render() {
    return (
      <Grid>
        <div className={s.root}>
          <div className={s.container}>
            <h1>Iranian American Professionals on LinkedIn</h1>
            <p>
              These statistics are based on sample of
              {' '}<span style={{ fontWeight: 'bold' }} id="count" />
              {' '}profiles.
            </p>

            {/* !-- Map -- */}
            <div id="usmap-tooltip" />
            <Row>
              <Col md={7} xs={12} className={s.vcenter}>
                <div id="usmap" />
              </Col>

              {/* !-- Gender -- */}
              <Col md={5} xs={12} className={s.vcenter}>
                <div id="gender-pie" />
              </Col>
              <div className="clearfix" />
            </Row>
            <Row>
              <Col md={12}>
                <div id="treemap" />
              </Col>
            </Row>

            <Row style={{ paddingTop: 50 }}>
              <p>
                Last update: <span id="last-update" />.
              </p>

              <Disclaimer />
            </Row>

          </div>
        </div>
      </Grid>
    );
  }
}

export default withStyles(s)(Content);
