import React, { PropTypes } from 'react';
import {
  Grid,
  Row,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { reset } from '../../../actions/donate';

class Success extends React.Component {
  static propTypes = {
    reset: PropTypes.func.isRequired,
    contact: PropTypes.shape({
      email: PropTypes.object.isRequired,
      fullName: PropTypes.object.isRequired,
      zipCode: PropTypes.object.isRequired,
    }),
  }

  componentWillUnmount() {
    this.props.reset();
  }

  render() {
    const { contact } = this.props;
    return (
      <Grid>
        <Row style={{ marginBottom: 100 }}>
          <h1> Thank You for Your Generous Support!</h1>
          <h4 style={{ lineHeight: '1.7em' }}>
            We have sent a confirmation email to <strong>{contact.email.value}</strong>.
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
}

export default connect(null, { reset })(Success);
