import React, { PropTypes } from 'react';
import { Glyphicon } from 'react-bootstrap';


class NullableBool extends React.Component {
  static propTypes = {
    value: PropTypes.bool,
  }

  render() {
    const value = this.props.value;
    if (value === true) {
      return (
        <div><Glyphicon glyph="ok" style={{ color: 'green' }} /></div>
      );
    }
    if (value === false) {
      return (
        <div><Glyphicon glyph="remove" style={{ color: 'red' }} /></div>
      );
    }
    return (<div />);
  }
}

export default NullableBool;
