import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  Grid,
  Row,
  Col,
  Button,
  Well,
  Collapse,
} from 'react-bootstrap';
import Toggle from 'react-bootstrap-toggle';
import validator from 'validator';
import { connect } from 'react-redux';
import { donate, createToken } from '../../actions/donate';
import s from './Donate.css';
import ButtonRadio from '../ButtonRadio';
import CreditCard from '../CreditCard';
import Alerts from '../Alerts';
import Loading from '../Loading';
import Success from './Success';
import Contact from './Contact';

class Donate extends React.Component {
  static propTypes = {
    Stripe: PropTypes.func.isRequired,

    donate: PropTypes.func.isRequired,
    createToken: PropTypes.func.isRequired,

    isFetching: PropTypes.bool.isRequired,
    publishableKey: PropTypes.bool.isRequired,
    success: PropTypes.bool.isRequired,
    token: PropTypes.string,
    contact: PropTypes.shape({
      email: PropTypes.object.isRequired,
      fullName: PropTypes.object.isRequired,
      zipCode: PropTypes.object.isRequired,
    }),
    errors: PropTypes.arrayOf(PropTypes.shape({
      message: PropTypes.string.isRequired,
    })),
  };

  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      contact: {
        email: { validation: null },
        fullName: { validation: null },
        zipCode: { validation: null },
        announceAmount: true,
        announceName: true,
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isFetching &&
      // pervents duplicate actions
        !nextProps.success &&
      // pervents action after success
        nextProps.errors.length === 0
      // pervents action after errors
    ) {
      this.donate(nextProps);
    }

    if (nextProps.errors.length > 0) {
      this.updateCreditData(null);
    }
  }

  donate(newProps) {
    const token = newProps.token;
    const amount = this.state.amount;

    if (token &&
        // check if there's a token already
        this.isValid()
        // double check form validation
    ) {
      // create token succeed, now post to our server
      this.props.donate(amount);
    }
  }

  submitByUser = () => {
    const card = {
      ...this.state.card,
      name: this.state.contact.fullName.value,
      address_zip: this.state.contact.zipCode.value,
    };

    const contact = this.state.contact;

    // create a stripe token with user credit card
    this.props.createToken(this.props.Stripe.card.createToken, card, contact);
  }

  isValid = () =>
    this.state.amount &&
    this.state.contact.email.validation &&
    this.state.contact.fullName.validation &&
    this.state.contact.zipCode.validation &&
    this.state.card &&
    this.props.publishableKey;

  updateCreditData = (card) => {
    this.setState({ card });
  };

  updateAmount = (amount) => {
    this.setState({ amount });
  }

  updateAmountAttr = (announceAmount) => {
    this.setState({
      contact: {
        ...this.state.contact,
        announceAmount,
      },
    });
  }

  updateNameAttr = (announceName) => {
    this.setState({
      contact: {
        ...this.state.contact,
        announceName,
      },
    });
  }

  updateContact = (event) => {
    const fieldName = event.target.name;
    const fieldVal = event.target.value;
    let valid;
    switch (fieldName) {
      case 'email':
        valid = validator.isEmail(fieldVal);
        break;
      case 'fullName':
        valid = fieldVal.split(' ').length > 1 && fieldVal.split(' ')[1].length > 2;
        break;
      case 'zipCode':
        // need to update this line of validation.
        valid = fieldVal.length;
        break;
      default:
        break;
    }
    this.setState({
      contact: {
        ...this.state.contact,
        [fieldName]: {
          value: fieldVal,
          validation: valid ? 'success' : 'error',
        },
      },
    });
  }

  render() {
    const { errors, isFetching, success, publishableKey, contact } = this.props;

    // Show waiting when trying to do donation and/or createToken
    if (isFetching && publishableKey) {
      return (
        <Loading>
          <div>
            <h1> Please wait while we process the payment ...</h1>
            <h4> Do not refresh this page! </h4>
          </div>
        </Loading>
      );
    }

    // Show success message
    if (success) {
      return (
        <Success contact={contact} />
      );
    }

    // Render form
    let submitText = 'Donate';
    if (this.state.amount) {
      submitText += ` $${this.state.amount.toLocaleString('en-US')}.00`;
    }
    return (
      <Grid>
        <Row>
          <h3>
            Your donations will be used to continuously maintain and update the data of this site.
          </h3>
        </Row>
        <Row>
          <Col sm={6}>
            <div className="page-header">
              <h3> Amount <small>(required)</small></h3>
              <ButtonRadio
                updateValue={this.updateAmount}
                options={{
                  values: [50, 100, 500, 1000],
                  format: 'currency',
                  init: this.state.amount,
                  other: true,
                }}
              />
              <h4>
                IACP welcomes donations of any amount.
              </h4>
            </div>

            {/* temporarily remove payment frequency*/}
            <Collapse in={false}>
              <div className="page-header">
                <h3> Frequency <small>(required)</small> </h3>
                <ButtonRadio
                  options={{
                    values: ['One Time', 'Monthly', 'Annualy'],
                    init: 'One Time',
                    format: 'text',
                  }}
                />
              </div>
            </Collapse>

            <div className="page-header">
              <h3> Contact Information <small>(required)</small></h3>
              <p>
                We require your contact information in order to provide you with
                proper tax documents.
              </p>

              <Contact
                contact={this.state.contact}
                updateContact={this.updateContact}
              />
            </div>
          </Col>
          <Col sm={6}>

            <div className="page-header">
              <h3> Announcement </h3>
              <p>
                We need your permission in order to announce your donation in our donation list:
              </p>

              <div style={{ marginBottom: 20 }}>
                Would you like us to announce your name?
                <div className={s.toggleContainer}>
                  <Toggle
                    onClick={this.updateNameAttr}
                    on="Yes"
                    off="No"
                    size="sm"
                    offstyle="danger"
                    active={this.state.contact.announceName}
                  />
                </div>
              </div>

              <div>
                Would you like us to announce the amount too?
                <div className={s.toggleContainer}>
                  <Toggle
                    onClick={this.updateAmountAttr}
                    on="Yes"
                    off="No"
                    size="sm"
                    offstyle="danger"
                    active={this.state.contact.announceAmount}
                  />
                </div>
              </div>
            </div>

            <div className="page-header">
              <h3> Payment </h3>
              <Well bsSize="small">
                <CreditCard updateCreditData={this.updateCreditData} />
                <h6>
                  * IACP does not store any credit card information. IACP processes all payments through {' '}
                  <a rel="noopener noreferrer" target="_blank" href="https://stripe.com/">Stripe.com</a>.
                </h6>
              </Well>

            </div>

            <Button
              bsStyle="primary"
              bsSize="large"
              block
              onClick={this.submitByUser}
              disabled={!this.isValid()}
            >
              {submitText}
            </Button>
            {/* #TODO move Collapse to Alerts Component */}
            <Collapse in={errors.length > 0} style={{ paddingTop: 10 }}>
              <div>
                <p>
                  The following error(s) happened while we were trying to process your donation:
                </p>
                <Alerts errors={errors} />
              </div>
            </Collapse>

          </Col>
        </Row>

        <Row>
          <h4 style={{ paddingBottom: 50, lineHeight: '1.7em' }}>
            IACP is a non-profit 501(c)(3) organization. IACP is a California non-profit.
            Its E.I. Number is 81-2676639.
            <br />
            All contributions are 100% tax deductible.
          </h4>
        </Row>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  errors: state.donate.errors,
  isFetching: state.donate.isFetching,
  publishableKey: state.donate.publishableKey,
  success: state.donate.success,
  token: state.donate.token,
  contact: state.donate.contact,
});

const DonateStyled = withStyles(s)(Donate);
const DonateStyledConnected = connect(mapStateToProps,
                                      { donate, createToken })(DonateStyled);
export default DonateStyledConnected;
