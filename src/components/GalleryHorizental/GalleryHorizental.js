import React, { PropTypes, } from 'react';
import { Col } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './GalleryHorizental.css';
import ImageGallery from '../ImageGallery';
import HorizontalScroll from '../HorizentalScroll'

class GalleryHorizental extends React.Component {
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
      <div className={s.item} key={i}>
        <ImageGallery
          element={element}
          key={i}
          thumbnailField={this.props.thumbnailField}
          thumbnailBase={this.props.thumbnailBase}
        />
      </div>
    ))
  );

  render = () => {
    return (
      <div className={s.container}>
        <HorizontalScroll
          reverseScroll={true}
        >
          { this.generateElements() }
          <div className={s.item, s.lastItem}>
            <h1><a href="/stories"> More Stories</a></h1>
          </div>
        </HorizontalScroll>
      </div>
    );
  }
}

export default withStyles(s)(GalleryHorizental);
