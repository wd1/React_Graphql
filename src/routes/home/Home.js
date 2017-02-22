/**   -*- mode: react; -*-
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import {
  Grid,
  Row,
  Col,
} from 'react-bootstrap';
// import queryString from 'query-string';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Home.css';
import VideoSlide from '../../components/VideoSlide';
import GalleryHorizental from '../../components/GalleryHorizental';
import storiesData from '../../public/stories-gallery/links.json';
import GraphsData from '../graphs/GraphsData';
import GraphThumbnail from '../../components/GraphThumbnail';
import Subscription from '../../components/Subscription';

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.stories = storiesData.slice(0, 4);
  }

  /* getFbEmbedParams() {
    const height = 792;
    const urlBase = 'https://www.facebook.com/plugins/page.php?';
    const urlParams = {
      height,
      href: 'https://www.facebook.com/iawfoundation',
      tabs: 'timeline',
      small_header: false,
      adapt_container_width: true,
      hide_cover: false,
      show_facepile: true,
      appId: '670829059722084',
    };
    const urlFull = urlBase + queryString.stringify(urlParams);

    const params = {
      src: urlFull,
      height,
      style: {
        border: null,
        overflow: 'hidden',
        width: '100%',
      },
      scrolling: 'no',
      frameBorder: 0,
      allowTransparency: true,
    };
    return params;
  } */

  renderGraphGalary() {
    const graphs = [
      GraphsData.scholars, GraphsData.california,
      GraphsData.attorneys, GraphsData.physiciansCalifornia,
      GraphsData.patents, GraphsData.linkedin,
    ];
    return graphs.map((graph, index) => (
      <Col xs={6} sm={6} md={4} key={index}>
        <GraphThumbnail data={graph} height={386} />
      </Col>
    ));
  }

  render() {
    // const fbEmbedParams = this.getFbEmbedParams();

    return (
      <Grid>
        {/* Presentation */}
        <Row>
          <Col xs={12} >
            <VideoSlide />
          </Col>
        </Row>

        {/* Stories */}
        <hr />
        <h2><strong>Contribution Stories:</strong></h2>

        <GalleryHorizental
          elements={this.stories}
          thumbnailField="imageFile"
          thumbnailBase="/stories-gallery/"
        />

        <hr />

        <Row>
          {/* Database */}
          <h2>
            <strong>IACP Database:</strong>
            {' '}<small>[<a href="/explore">Complete List</a>]</small>
          </h2>

          {this.renderGraphGalary()}
        </Row>

        <hr />
        {/* Subscription */}
        <h2>
          <strong>
            Stay up to date:
          </strong>
        </h2>
        <Subscription />

      </Grid>
    );
  }
}

export default withStyles(s)(Home);
