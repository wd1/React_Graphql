import React, { Component, PropTypes } from 'react'
import DOM from 'react-dom'
import { Motion, spring, presets } from 'react-motion'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './HorizentalScroll.css';
import { Glyphicon } from 'react-bootstrap';

class HorizontalScroll extends Component {
  constructor(props) {
    super(props)
    this.state = { animValues: 0 }
    this.maxScroll = false;
  }

  componentDidUpdate(nextProps, nextState) {

    // Calculate the bounds of the scroll area
    let el = DOM.findDOMNode(this.refs['hScrollParent'])

    let max = el.lastElementChild.scrollWidth
    let win = el.offsetWidth

    // Get the new animation values
    var curr = this.state.animValues

    // Establish the bounds. We do this every time b/c it might change.
    var bounds = -(max - win)
    this.maxScroll = bounds;

    // Logic to hold everything in place
    if (curr >= 1) {
      this.setState({ animValues: 0 })
    } else if (curr <= bounds) {
      this.setState({ animValues: bounds + 1 })
    }

  }

  onTouchStart(e) {
    e.preventDefault();
    this.touchStartTouch = e.changedTouches[0].clientX;
    this.touchStartAnimValues = this.state.animValues;
  }

  onTouchMove(e) {
    e.preventDefault()
    var delta = e.changedTouches[0].clientX - this.touchStartTouch;
    var newAnimationValue = this.touchStartAnimValues + delta * 2;
    ::this.scroll(newAnimationValue);
  }

  onWheel(e) {
    e.preventDefault()
    // If scrolling on x axis, change to y axis
    // Otherwise just get the y deltas
    // Basically, this for Apple mice that allow
    // horizontal scrolling by default
    var rawData = e.deltaY ? e.deltaY : e.deltaX;
    var mouseY = Math.floor(rawData);
    var newAnimationValue = this.state.animValues - mouseY;
    ::this.scroll(newAnimationValue);
  }

  scrollDelta(delta) {
    var newAnimationValue = this.state.animValues - delta;
    ::this.scroll(newAnimationValue);
  }

  scroll(newAnimationValue) {
    var scrolling = () => {
      this.setState({ animValues: newAnimationValue });
    }

    // Begin Scrolling Animation
    requestAnimationFrame(scrolling)
  }

  render() {
    // Styles
    const styles = {
      height: `100%`,
      width: `100%`,
      position: `relative`,
      overflow: `hidden`,
            ...styles
    }
    return (
      <div style={ styles }>
        <div
          onWheel={::this.onWheel}
          onTouchMove={::this.onTouchMove}
          onTouchStart={::this.onTouchStart}
          ref='hScrollParent'
          className='scroll-horizontal'
        >
          <Motion style={ { z: spring(this.state.animValues) } }>
            { ({z}) => {
                const scrollingElementStyles = {
                  transform: `translate3d(${z}px, 0,0)`,
                  display: `inline-flex`,
                  height: `100%`,
                  position: `absolute`,
                  willChange:`transform`
                }
                return (
                  <div style={ scrollingElementStyles }>
                    { this.props.children }
                  </div>
                )
              } }
          </Motion>
        </div>
        { this.state.animValues ?
          <div
            className={s.buttonPrevContainer}
            onClick={(e) => ::this.scrollDelta(-300)}
          >
            <h1 className={s.buttonPrev}>
              <Glyphicon glyph="menu-left" />
            </h1>
          </div>
           : ''}
         { (this.maxScroll === false) || (this.state.animValues > (this.maxScroll + 20)) ?
           <div
             className={s.buttonNextContainer}
             onClick={(e) => ::this.scrollDelta(300)}
           >
             <h1 className={s.buttonNext}>
               <Glyphicon glyph="menu-right" />
             </h1>
           </div>
            : ''}
      </div>
    )
  }
}

export default withStyles(s)(HorizontalScroll);
