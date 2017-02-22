import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import makeAsyncScriptLoader from 'react-async-script';
import { connect } from 'react-redux';
import { setPublishableKey } from '../../actions/donate';
import s from './Donate.css';
import { STRIPEPUBKEY } from '../../config';
import DonateComponent from '../../components/Donate';
import Alerts from '../../components/Alerts';
import Loading from '../../components/Loading';

const STRIPEURL = 'https://js.stripe.com/v2/';

class Donate extends React.Component {
  static propTypes = {
    Stripe: PropTypes.func,
    setPublishableKey: PropTypes.func.isRequired,

    isFetching: PropTypes.bool.isRequired,
    publishableKey: PropTypes.bool.isRequired,
    errors: PropTypes.arrayOf(PropTypes.shape({
      message: PropTypes.string.isRequired,
    })),
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isFetching &&
      // pervents action after success
        nextProps.errors.length === 0
      // pervents action after errors
    ) {
      this.setPublishableKey(nextProps);
    }
  }

  setPublishableKey = (newProps) => {
    if (newProps.Stripe &&
        // wait for Stripe
        !newProps.publishableKey
        // don't set key if a key has been already set
    ) {
      // set public key to stripe loaded function
      this.props.setPublishableKey(newProps.Stripe.setPublishableKey, STRIPEPUBKEY);
    }
  }

  render() {
    const { publishableKey, errors, Stripe } = this.props;

    if (Stripe && publishableKey) {
      return (
        <DonateComponent Stripe={Stripe} />
      );
    }
    if (errors.length > 0) {
      return (
        <Alerts errors={errors} />
      );
    }
    return (
      <Loading />
    );
  }
}

const mapStateToProps = (state) => ({
  isFetching: state.donate.isFetching,
  publishableKey: state.donate.publishableKey,
  errors: state.donate.errors,
});

const DonateStyled = withStyles(s)(Donate);
const DonateStyledConnected = connect(mapStateToProps,
                                      { setPublishableKey })(DonateStyled);
const DonateDependencies = makeAsyncScriptLoader(DonateStyledConnected, STRIPEURL, {
  globalName: 'Stripe',
});

export default DonateDependencies;
