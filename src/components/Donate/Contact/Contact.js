import React, { PropTypes } from 'react';
import {
  Form,
  Col,
  FormGroup,
  ControlLabel,
  FormControl,
} from 'react-bootstrap';

class Contact extends React.Component {
  static propTypes = {
    updateContact: PropTypes.func.isRequired,
    contact: PropTypes.shape({
      email: PropTypes.object.isRequired,
      fullName: PropTypes.object.isRequired,
      zipCode: PropTypes.object.isRequired,
    }),
  }

  render() {
    const { contact, updateContact } = this.props;
    const { fullName, email, zipCode } = contact;
    return (
      <Form horizontal >

        {/* full name */}
        <FormGroup
          controlId="formHorizontalfullName"
          validationState={fullName.validation}
        >
          <Col componentClass={ControlLabel} sm={2}>
            Full Name
          </Col>
          <Col sm={7}>
            <FormControl
              name="fullName"
              type="text"
              placeholder="Full Name"
              onChange={updateContact}
              value={fullName.value || ''}
            />
          </Col>
        </FormGroup>

        {/* Email */}
        <FormGroup
          controlId="formHorizontalEmail"
          validationState={email.validation}
        >
          <Col componentClass={ControlLabel} sm={2}>
            Email
          </Col>
          <Col sm={7}>
            <FormControl
              name="email"
              type="email"
              placeholder="Email"
              onChange={updateContact}
              value={email.value || ''}
            />
          </Col>
        </FormGroup>

        {/* Zip Code */}
        <FormGroup
          controlId="formHorizontalZip"
          validationState={zipCode.validation}
        >
          <Col componentClass={ControlLabel} sm={2}>
            Zip/Postal Code
          </Col>
          <Col sm={7}>
            <FormControl
              name="zipCode"
              type="text"
              placeholder="Zip/Postal Code"
              onChange={updateContact}
              value={zipCode.value || ''}
            />
          </Col>
        </FormGroup>

      </Form>
    );
  }
}

export default (Contact);
