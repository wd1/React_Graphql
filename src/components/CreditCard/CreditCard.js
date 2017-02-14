import React, { PropTypes } from 'react';
import { Form, Col, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import Payment from 'payment';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './CreditCard.css';

class CreditCard extends React.Component {
  static propTypes = {
    updateCreditData: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      form: {
        number: {},
        expiration: {},
        cvc: {},
      },
      disabled: false,
    };
  }

  handleChange = (event) => {
    const fieldName = event.target.name;
    const fieldVal = event.target.value;

    let valid;
    switch (fieldName) {
      case 'number':
        valid = Payment.fns.validateCardNumber(fieldVal);
        break;
      case 'expiration':
        valid = Payment.fns.validateCardExpiry(fieldVal);
        break;
      case 'cvc':
        valid = Payment.fns.validateCardCVC(fieldVal);
        break;
      default:
        break;
    }
    const form = {
      ...this.state.form,
      [fieldName]: {
        value: fieldVal,
        validation: valid ? 'success' : 'error',
      },
    };

    const disabled = !Object.keys(form).reduce((result, key) => result && (form[key].validation === 'success'), true);

    if (!disabled) {
      const number = form.number.value;
      const cvc = form.cvc.value;

      const expiration = form.expiration.value.split('/');
      const exp_month = parseInt(expiration[0], 10);
      const exp_year = parseInt(expiration[1], 10);

      const card = { number, exp_month, exp_year, cvc };

      this.props.updateCreditData(card);
    } else {
      this.props.updateCreditData(null);
    }

    this.setState({ form, disabled });
  };

  render() {
    return (
      <div className="CreditCard">
        <Form horizontal onSubmit={this.handleSubmit}>
          <FormGroup validationState={this.state.form.number.validation}>
            <Col componentClass={ControlLabel} sm={4}>
              Card Number
            </Col>
            <Col sm={7}>
              <FormControl type="text" name="number" placeholder="Card Number" defaultValue={this.state.form.number.value} onChange={this.handleChange} />
            </Col>
          </FormGroup>

          <FormGroup validationState={this.state.form.expiration.validation}>
            <Col componentClass={ControlLabel} sm={4}>
              Expiration
            </Col>
            <Col sm={7}>
              <FormControl type="text" name="expiration" placeholder="MM/YY" defaultValue={this.state.form.expiration.value} onChange={this.handleChange} />
            </Col>
          </FormGroup>

          <FormGroup validationState={this.state.form.cvc.validation}>
            <Col componentClass={ControlLabel} sm={4}>
              CVC
            </Col>
            <Col sm={7}>
              <FormControl type="text" name="cvc" placeholder="CVC" defaultValue={this.state.form.cvc.value} onChange={this.handleChange} />
            </Col>
          </FormGroup>
        </Form>
      </div>
    );
  }
}

export default withStyles(s)(CreditCard);
