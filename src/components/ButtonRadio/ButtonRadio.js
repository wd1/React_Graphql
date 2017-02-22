/**  -*- mode: react; -*-
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  ButtonToolbar,
  Button,
  FormGroup,
  InputGroup,
  ControlLabel,
  FormControl,
} from 'react-bootstrap';
import s from './ButtonRadio.css';

class ButtonRadio extends React.Component {
  static propTypes = {
    updateValue: PropTypes.func,
    options: PropTypes.shape({
      values: PropTypes.array.isRequired,
      format: PropTypes.string,
      other: PropTypes.bool,
      init: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
    }),
  };

  constructor(props) {
    super(props);
    this.state = { value: this.props.options.init };
  }

  onChangeButton = (value) => {
    this.setState({ value });
    if (this.props.updateValue) {
      this.props.updateValue(value);
    }
  }

  onChangeOther = (event) => {
    const value = parseInt(event.target.value, 10) || '';
    this.setState({ value });
    if (this.props.updateValue) {
      this.props.updateValue(value);
    }
  }

  format(value) {
    let text;
    switch (this.props.options.format) {
      case 'currency':
        text = `$${value}`;
        break;
      default:
        text = value;
    }
    return text;
  }

  renderButton(value) {
    const text = this.format(value);
    const selected = this.state.value === value;
    const style = selected ? 'success' : 'default';
    return (
      <Button
        bsStyle={style}
        active={selected}
        key={value}
        onClick={() => this.onChangeButton(value)}
      >
        {text}
      </Button>
    );
  }

  renderOther() {
    return (
      <FormGroup className={s.otherForm}>
        <InputGroup className={s.otherInput}>
          <InputGroup.Addon>$</InputGroup.Addon>
          <FormControl
            type="text"
            onChange={this.onChangeOther}
            value={this.state.value || 0}
          />
          <InputGroup.Addon>.00</InputGroup.Addon>
        </InputGroup>
      </FormGroup>
    );
  }

  render() {
    const buttons = this.props.options.values.map(::this.renderButton);
    let other = null;
    if (this.props.options.other) {
      other = this.renderOther();
    }
    return (
      <div>
        <ButtonToolbar>
          {buttons}
        </ButtonToolbar>
        {other}
      </div>
    );
  }
}

export default withStyles(s)(ButtonRadio);
