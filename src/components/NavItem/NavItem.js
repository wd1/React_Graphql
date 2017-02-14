import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { NavItem as OrigNavItem } from 'react-bootstrap';
import history from '../../core/history';

class NavItem extends React.Component {
  static propTypes = {
    href: PropTypes.string,
  };
  static defaultProps = {
    href: null,
  }
  constructor(props) {
    super(props);
    this.state = {
      currentPath: null,
    };
  }
  componentDidMount() {
    this.update();
  }
  componentDidUpdate() {
    this.update();
  }
  update() {
    if (this.state.currentPath !== location.pathname) {
      this.setState({ currentPath: location.pathname });
    }
  }
  click(e) {
    e.preventDefault();
    history.push(this.props.href);
  }
  render() {
    const active = this.state.currentPath === this.props.href;
    const classes = classNames({ active });
    return (
      <OrigNavItem className={classes} onClick={(e) => this.click(e)} {...this.props} />
    );
  }
}

export default NavItem;
