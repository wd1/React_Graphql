import React, {
  PropTypes,
} from 'react';
import {
  Button,
  Thumbnail,
} from 'react-bootstrap';

class GraphThumbnail extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      title: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      description: PropTypes.string,
      link: PropTypes.string.isRequired,
    }),
    height: PropTypes.number.isRequired,
  };

  render = () => {
    let graph = this.props.data;
    let height = this.props.height;
    return (
      <Thumbnail src={graph.image} alt={graph.title} style={{height:height}}>
        <h3>{graph.title}</h3>
        <p>{graph.description}</p>
        <p>
          <Button bsStyle="primary" href={graph.link}>Explore</Button>
        </p>
      </Thumbnail>
    );

  }
}

export default GraphThumbnail;
