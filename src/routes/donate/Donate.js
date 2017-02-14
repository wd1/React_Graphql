import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import makeAsyncScriptLoader from 'react-async-script';
import {
  Grid,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
  Well,
  Collapse,
  Alert,
} from 'react-bootstrap';
import validator from 'validator';
import s from './Donate.css';
import ButtonRadio from '../../components/ButtonRadio';
import CreditCard from '../../components/CreditCard';
import fetch from '../../core/fetch';
import { STRIPEPUBKEY } from '../../config';

const STRIPEURL = 'https://js.stripe.com/v2/';

class Donate extends React.Component {
  static propTypes = {
    Stripe: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.state = {
      status: 'loading', // loading / normal / submitting / error / success
      disabled: false,
      contact: {
        email: { validation: null },
        fullName: { validation: null },
        zipCode: { validation: null },
      },
    };
    this.setPublishableKey(props);
  }

  componentWillReceiveProps(nextProps) {
    this.setPublishableKey(nextProps);
  }

  setPublishableKey(newProps) {
    if (newProps.Stripe) {
      newProps.Stripe.setPublishableKey(STRIPEPUBKEY);
      this.setState({ status: 'normal' });
    }
  }

  submitByUser = () => {
    const card = {
      ...this.state.card,
      name: this.state.contact.fullName.value,
      address_zip: this.state.contact.zipCode.value,
    };
    this.setState({ status: 'submitting' });
    this.props.Stripe.card.createToken(card, ::this.stripeResponseHandler);
  }

  async stripeResponseHandler(status, response) {
    // Stripe Request Error !200
    if (status !== 200) {
      this.setState({
        status: 'error',
        errorMsg: 'Unexpected error while communicating with Stripe server!',
      });
      return;

    // Stripe Request Error, more generic
    } else if (response.error) {
      this.setState({
        status: 'error',
        errorMsg: response.error.message,
      });
      return;
    }

    // Stripe succeed, now post to our server
    fetch('/api/charge', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: response.id,
        email: this.state.contact.email.value,
        fullName: this.state.contact.fullName.value,
        zipCode: this.state.contact.zipCode.value,
        amount: this.state.amount,
      }),
    }).then(fetchResp => {
      if (!fetchResp.ok) {
        this.setState({
          status: 'error',
          errorMsg: 'Unexpected error while communicating with server!',
        });
      } else {
        this.setState({
          card: null,  // security purposes
          status: 'success',
        });
      }
    }).catch(() => {
      this.setState({
        status: 'error',
        errorMsg: 'Unexpected error while communicating with server!',
      });
    });
  }

  isValid = () =>
    this.state.amount &&
    this.state.contact.email.validation &&
    this.state.contact.fullName.validation &&
    this.state.contact.zipCode.validation &&
    this.state.card;

  updateCreditData = (card) => {
    this.setState({ card });
  };

  updateAmount = (amount) => {
    this.setState({ amount });
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
        valid = fieldVal.split(' ').length > 1;
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

  renderAlert = () => {
    if (this.state.status !== 'error') {
      return null;
    }
    return (
      <Alert bsStyle="danger">
        The following error happened while we were trying to process your donation:
        <br />
        {this.state.errorMsg}
      </Alert>
    );
  }


  renderSuccess() {
    return (
      <Grid>
        <Row style={{ marginBottom: 100 }}>
          <h1> Thank You for Your Generous Support!</h1>
          <h4 style={{ lineHeight: '1.7em' }}>
            We have sent a confirmation email to <strong>{this.state.contact.email.value}</strong>.
            <br /><br />
            IACP is a non-profit 501(c)(3) organization. IACP is a California non-profit.
            Its E.I. Number is 81-2676639.
            <br />
            All contributions are 100% tax deductible.
            <br />
            If you did not recieve your tax receipt document via email, please contact us at
            {' '}<a href="mailto:info@ia-cp.org">info@ia-cp.org</a>.
          </h4>
        </Row>
      </Grid>
    );
  }

  render() {
    // Loading
    if (this.state.status === 'loading') {
      return (
        <Grid>
          <h1> Loading ...</h1>
        </Grid>
      );
    }

    // Submiting
    if (this.state.status === 'submitting') {
      return (
        <Grid>
          <h1> Please wait while we process the payment ...</h1>
          <h4> Do not refresh this page! </h4>
        </Grid>
      );
    }

    // Success
    if (this.state.status === 'success') {
      return this.renderSuccess();
    }

    // Normal
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
                  init: '',
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
              <Form horizontal ref={(input) => { this.contact = input; }} >

                {/* full name */}
                <FormGroup
                  controlId="formHorizontalfullName"
                  validationState={this.state.contact.fullName.validation}
                >
                  <Col componentClass={ControlLabel} sm={2}>
                    Full Name
                  </Col>
                  <Col sm={7}>
                    <FormControl name="fullName" type="text" placeholder="Full Name" onChange={this.updateContact} />
                  </Col>
                </FormGroup>

                {/* Email */}
                <FormGroup
                  controlId="formHorizontalEmail"
                  validationState={this.state.contact.email.validation}
                >
                  <Col componentClass={ControlLabel} sm={2}>
                    Email
                  </Col>
                  <Col sm={7}>
                    <FormControl name="email" type="email" placeholder="Email" onChange={this.updateContact} />
                  </Col>
                </FormGroup>

                {/* Zip Code */}
                <FormGroup
                  controlId="formHorizontalZip"
                  validationState={this.state.contact.zipCode.validation}
                >
                  <Col componentClass={ControlLabel} sm={2}>
                    Zip/Postal Code
                  </Col>
                  <Col sm={7}>
                    <FormControl name="zipCode" type="text" placeholder="Zip/Postal Code" onChange={this.updateContact} />
                  </Col>
                </FormGroup>

              </Form>
            </div>
          </Col>
          <Col sm={6}>

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
            <Collapse in={this.state.status === 'error'} style={{ paddingTop: 10 }}>
              <div>
                {this.renderAlert()}
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

const DonateStyled = withStyles(s)(Donate);
const DonateDependencies = makeAsyncScriptLoader(DonateStyled, STRIPEURL, {
  globalName: 'Stripe',
});
export default DonateDependencies;
