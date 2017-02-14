import React, {
  PropTypes,
} from 'react';
import { Col } from 'react-bootstrap';
import Masonry from 'react-masonry-component';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Gallery.css';
import ImageGallery from '../ImageGallery';

class Gallery extends React.Component {
  static propTypes = {
    elements: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        imageFile: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      }),
    ),
    thumbnailField: PropTypes.string,
    thumbnailBase: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      elements: props.elements,
    };
  }

  generateElements = () => (
    this.state.elements.map((element, i) => (
      <Col key={i} xs={6} sm={4} className={s.item}>
        <ImageGallery
          element={element}
          key={i}
          thumbnailField={this.props.thumbnailField}
          thumbnailBase={this.props.thumbnailBase}
        />
      </Col>
    ))
  );

  render = () => {
    const masonryOptions = {
      transitionDuration: 400,
    };
    return (
      <Masonry
        className={'my-gallery-class'} // default ''
        elementType={'div'} // default 'div'
        options={masonryOptions} // default {}
        disableImagesLoaded={false} // default false
        // default false and works only if disableImagesLoaded is false
        updateOnEachImageLoad={false}
      >
        {this.generateElements()}
      </Masonry>
    );
  }
}

export default withStyles(s)(Gallery);
