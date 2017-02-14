import React, {
  PropTypes,
} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ImageGallery.css';

class ImageGallery extends React.Component {
  static propTypes = {
    element: PropTypes.shape({
      title: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      imageFile: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
    thumbnailField: PropTypes.string,
    thumbnailBase: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      element: props.element,
      thumbnailField: props.thumbnailField,
      thumbnailBase: props.thumbnailBase,
    };
  }

  render = () => {
    const imgStyle = {
      height: 'auto',
      width: '100%',
    };
    const element = this.state.element;
    return (
      <div className={s.hovereffect}>
        <img
          style={imgStyle}
          className="img-responsive"
          alt={element.title}
          src={this.state.thumbnailBase + element[this.state.thumbnailField]}
        />
        <div className={s.overlay}>
          <h2><a href={element.url} target="_blank">{element.title}</a></h2>
          <a className={s.info} href={element.url} target="_blank">Read More ...</a>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(ImageGallery);
