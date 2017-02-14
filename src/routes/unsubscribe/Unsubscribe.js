import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  Grid,
  Row,
  Alert,
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
  Button,
} from 'react-bootstrap';
import s from './Unsubscribe.css';
import fetch from '../../core/fetch';


class Unsubscribe extends React.Component {
  static propTypes = {
    unsubKey: PropTypes.string.isRequired,
    email: PropTypes.string,
    errors: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      // notexist / normal / submitting / error / success
      status: props.errors.length ? 'notexist' : 'normal',
    };
  }

  submitByUser = () => {
    const okResponse = () => {
      this.setState({ status: 'success' });
    };

    const errorResponse = () => {
      this.setState({ status: 'error' });
    };

    this.setState({ status: 'submitting' });
    fetch('/graphql', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `mutation _ {
          unsubscribe (key: "${this.props.unsubKey}") {
            errors {
              key
              message
            }
            success
          }
        }`,
      }),
    }).then(fetchResp => {
      if (!fetchResp.ok) {
        errorResponse();
        return;
      }
      fetchResp.json().then((jsonResp) => {
        if (!jsonResp.data.unsubscribe) {
          errorResponse();
          return;
        }
        if (!jsonResp.data.unsubscribe.success) {
          errorResponse();
          return;
        }
        okResponse();
      }).catch(() => {
        errorResponse();
      });
    }).catch(() => {
      errorResponse();
    });
  }

  renderAlert = () => {
    if (this.state.status === 'error') {
      return (
        <Alert bsStyle="danger">
          An error happend while communicating with server! Please try again.
        </Alert>
      );
    }
    return null;
  }

  render() {
    // notexist
    if (this.state.status === 'notexist') {
      return (
        <Grid style={{ paddingBottom: 150 }}>
          <Alert bsStyle="danger">
            <h3>
              This email does not exist in our database!
            </h3>
          </Alert>
        </Grid>
      );
    }

    // Submiting
    if (this.state.status === 'submitting') {
      return (
        <Grid>
          <h3> Please wait ...</h3>
        </Grid>
      );
    }

    // Submiting
    if (this.state.status === 'submitting') {
      return (
        <Grid>
          <h3> Please wait ...</h3>
        </Grid>
      );
    }

    // Success
    if (this.state.status === 'success') {
      return (
        <Grid>
          <Row style={{ paddingBottom: 150 }}>
            <Alert bsStyle="success">
              <h3>
                Your email is removed from our mailing list!
              </h3>
            </Alert>
          </Row>
        </Grid>
      );
    }

    // Normal & Error
    return (
      <Grid>
        {this.renderAlert()}
        <Row style={{ paddingBottom: 150 }}>
          <h3>
            Unsubscribe from IACP Mailing List.
          </h3>
          <h4>
            Are you sure you want to unsubscribe from IACP{'\''}s newsletter?
          </h4>
          <Form inline style={{ padding: 30 }}>
            <FormGroup>
              <ControlLabel>Email:</ControlLabel>
              {' '}
              <FormControl type="text" value={this.props.email} disabled />
            </FormGroup>
          </Form>
          <Button bsStyle="primary" onClick={this.submitByUser}>
            Yes! Unsubscribe
          </Button>
        </Row>
      </Grid>
    );
  }
}

export default withStyles(s)(Unsubscribe);
