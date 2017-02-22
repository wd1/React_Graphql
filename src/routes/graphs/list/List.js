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
      GraphsData.attorneys, GraphsData.physiciansCalifornia,
      GraphsData.patents, GraphsData.linkedin,
    ];
    const futures = [
      { title: 'IA Impact on Art' },
      { title: 'Iranian-American Athletics' },
      { title: 'Nation Wide IA Attorneys' },
      { title: 'IA Won Awards' },
      { title: 'IA Business Owners' },
      { title: 'Chiropractors' },
      { title: 'Iranian-American Impact on US Companies', description: 'List of Companies' },
      { title: 'Iranian-American CPAs' },
      { title: 'Iranian-American Educational Degrees' },
      { title: 'Iranian-American Dentists' },
      { title: 'Executives: C-level, Director, VP' },
      { title: 'Iranian-American Fire Fighters' },
      { title: 'Founders and Co-Founders' },
      { title: 'Iranian-American in Military' },
      { title: 'Iranian-American Nurses and Assistants' },
      { title: 'Philanthropists' },
      { title: 'Nation Wide Physicians' },
      { title: 'Physican\'s Assistants' },
      { title: 'Police and Law Enforcement' },
      { title: 'University Professors' },
      { title: 'Real Estate Developers and Professionals' },
      { title: 'Iranian-American Teachers' },
    ].map(item => Object.assign({}, GraphsData.future, item));

    return (
      <Grid>
        <h1>Explore IACP Database</h1>
        <Row>
          {this.renderGraphGalary(graphs)}
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
