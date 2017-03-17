import React, {
  PropTypes,
} from 'react';
import {
  Grid,
  Row,
  Col,
} from 'react-bootstrap';
import GraphsData, { Disclaimer } from '../GraphsData';
import GraphThumbnail from '../../../components/GraphThumbnail';

class GraphsListPage extends React.Component {
  static propTypes = {
    title: PropTypes.string,
  };

  renderGraphGalary(graphs) {
    return graphs.map((graph, index) => (
      <Col xs={6} md={4} key={index}>
        <GraphThumbnail data={graph} height={400} />
      </Col>
    ));
  }

  render() {
    const graphs = [
      GraphsData.scholars, GraphsData.california,
      GraphsData.attorneys, GraphsData.patents,
      GraphsData.linkedin,
    ];
    const healthcare = [
      GraphsData.healthcare.physicians,
      GraphsData.healthcare.dentists,
      GraphsData.healthcare.pharmacists,
      GraphsData.healthcare.nurses,
      GraphsData.healthcare.therapists,
      GraphsData.healthcare.chiropractors,
    ];
    const futures = [
      { title: 'Impact on Arts' },
      { title: 'Athletics' },
      { title: 'Attorneys - Nationwide' },
      { title: 'Awards' },
      { title: 'Business Owners' },
      { title: 'Impact on US Companies', description: 'List of Companies' },
      { title: 'CPAs' },
      { title: 'Educational Degrees' },
      { title: 'Dentists' },
      { title: 'Executives: C-level, Director, VP' },
      { title: 'Fire Fighters' },
      { title: 'Founders and Co-Founders' },
      { title: 'Serving in the Military' },
      { title: 'Nurses and Assistants' },
      { title: 'Philanthropists' },
      { title: 'Nation Wide Physicians' },
      { title: 'Physican\'s Assistants' },
      { title: 'Police and Law Enforcement' },
      { title: 'University Professors' },
      { title: 'Real Estate Developers and Professionals' },
      { title: 'Teachers' },
    ].map(item => Object.assign({}, GraphsData.future, item));

    return (
      <Grid>
        <h1>Explore IACP Database</h1>
        <Row>
          {this.renderGraphGalary(graphs)}
        </Row>
        <hr />
        <h2>Health Care</h2>
        <Row>
          {this.renderGraphGalary(healthcare)}
        </Row>
        <hr />
        <h2>Future Data Analysis</h2>
        <Row>
          {this.renderGraphGalary(futures)}
        </Row>
        <Disclaimer />
      </Grid>
    );
  }
}


export default GraphsListPage;
