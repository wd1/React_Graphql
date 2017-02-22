import React, { PropTypes } from 'react';
import {
  Row,
  ResponsiveEmbed,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem,
  Glyphicon,
} from 'react-bootstrap';
import YouTube from 'react-youtube';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './VideoSlide.css';
import Presentation from '../Presentation';

class VideoSlide extends React.Component {
  static propTypes = {
    videoId: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    segments: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  constructor(props) {
    super(props);
    this.player = undefined;
    this.timer = undefined;
    this.state = {
      activeTab: 'video',
      activeSegment: -1,
    };
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  handleSelect(e) {
    const eventKey = e.split('.');
    const newState = { activeTab: eventKey[0] };
    if (this.player && (eventKey[0] === 'video')) {
      const segment = eventKey[1];
      this.player.seekTo(this.props.segments[segment].start);
      newState.activeSegment = segment;
    }
    this.setState(newState);
  }

  updateActiveSegment() {
    const t = this.player.getCurrentTime();
    let index;
    if (t === 0) {
      index = null;
    } else {
      index = this.props.segments.findIndex((segment) => (segment.start > t));
      index = (index === -1) ? (this.props.segments.length - 1) : index - 1;
      index = Math.max(0, index);
    }
    this.setState({ activeSegment: index });
  }

  YTReady(e) {
    const player = e.target;
    this.player = player;
    this.timer = setInterval(() => this.updateActiveSegment(), 500);
  }

  renderMenuItem(segment, index) {
    const start = segment.start;
    const end = (index === (this.props.segments.length - 1)) ?
                  this.props.duration :
                  this.props.segments[index + 1].start;
    let duration = end - start;
    duration = ((duration - (duration %= 60)) / 60) + ((duration > 9) ? ':' : ':0') + duration;

    const active = (index === this.state.activeSegment);
    return (
      <MenuItem eventKey={`video.${index}`} key={index} className={active ? 'activeSegment' : ''}>
        {
          active ?
          (<b>Playing Now ({duration}): {' '}</b>) :
          <span>(<Glyphicon glyph="facetime-video" /> {duration}) </span>
        }
        {segment.title}
      </MenuItem>
    );
  }

  render() {
    return (
      <div>
        <Row>
          <Nav
            className="video-section-selector"
            bsStyle="pills"
            justified
            activeKey={this.state.activeTab}
            onSelect={(e) => this.handleSelect(e)}
          >
            <NavItem eventKey="slides">
              Slides
            </NavItem>
            <NavDropdown
              id="vide-segment-selector"
              eventKey="video"
              title="Video Segments Introducing IACP"
              onClick={() => this.setState({ activeTab: 'video' })}
            >
              {this.props.segments.map(::this.renderMenuItem)}
            </NavDropdown>
          </Nav>
        </Row>

        <Row className={this.state.activeTab !== 'slides' ? '' : 'hidden'}>
          <ResponsiveEmbed a16by9>
            <YouTube
              videoId={this.props.videoId}
              opts={{
                playerVars: {
                  showinfo: 0,
                  rel: 0,
                },
              }}
              onReady={(e) => this.YTReady(e)}
            />
          </ResponsiveEmbed>
        </Row>
        <Row className={this.state.activeTab === 'slides' ? '' : 'hidden'}>
          <Presentation />
        </Row>
      </div>
    );
  }
}

VideoSlide.defaultProps = {
  videoId: 'wEnNRjmunoQ',
  duration: (58 * 60) + 56,
  segments: [
    {
      title: 'Intro to IACP - Why it matters - Creating a brand',
      start: 0,
    },
    {
      title: 'What we do, What we don\'t do - Our non-profit status',
      start: (17 * 60) + 30,
    },
    {
      title: 'Technology update - Data obtained so far',
      start: (22 * 60) + 30,
    },
    {
      title: 'Sharing Life Stories',
      start: (36 * 60) + 47,
    },
    {
      title: 'Creating a multi-generational platform - Our roadmap - The teams we need',
      start: (40 * 60) + 20,
    },
    {
      title: 'Our Choices as a community - Conclusion',
      start: (50 * 60) + 45,
    },
  ],
};


export default withStyles(s)(VideoSlide);
