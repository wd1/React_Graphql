import React from 'react';
import {
  Form,
  Well,
  FormGroup,
  FormControl,
  Button,
  Alert,
} from 'react-bootstrap';
import validator from 'validator';
import Spinner from 'react-spin';

class Subscription extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: null,
      valid: null,
      status: 'normal', // normal / submitting / success / error
    };
  }

  updateEmail = (event) => {
    const email = event.target.value;
    const valid = validator.isEmail(email);
    this.setState({
      email,
      valid: valid ? 'success' : 'error',
    });
  }

  submitByUser = (event) => {
    const okResponse = () => {
      this.setState({ status: 'success' });
    };

    const errorResponse = () => {
      this.setState({ status: 'error' });
    };

    event.preventDefault();
    fetch('/graphql', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `mutation _ {
          subscribe (email: "${this.state.email}") {
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
        if (!jsonResp.data.subscribe) {
          errorResponse();
          return;
        }
        if (!jsonResp.data.subscribe.success) {
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

  render() {
    let form;
    if (this.state.status === 'normal' || this.state.status === 'error') {
      form = (
        <div>
          {this.state.status === 'error' &&
            <Alert bsStyle="danger">
              An unexpected error happened while we were communicating with the server. Please{' '}
              try again!
            </Alert>
          }

          <FormGroup validationState={this.state.valid}>
            <FormControl type="email" placeholder="Email (required)" onChange={this.updateEmail} />
          </FormGroup>
          {' '}
          <Button
            type="submit"
            bsStyle="success"
            onClick={this.submitByUser}
            disabled={!(this.state.valid === 'success')}
          >
            Subscribe
          </Button>
        </div>
      );
    } else if (this.state.status === 'submitting') {
      const spinCfg = {
        lines: 11,
        length: 14,
        width: 8,
        radius: 12,
        scale: 0.33,
      };
      form = (
        <div style={{ position: 'relative', height: 34 }}>
          <Spinner config={spinCfg} />
        </div>
      );
    } else if (this.state.status === 'success') {
      form = (
        <Alert bsStyle="success">
          Your email has been successfully added to the mailing list.
        </Alert>
      );
    }

    return (
      <Well>
        <h3>
          Please join our mailing list to receive our newsletter and occasional updates on our{' '}
          progress:
        </h3>
        <Form inline style={{ textAlign: 'center', margin: 20 }}>
          {form}
        </Form>
        <p>
          Your email address will be kept confidential and will not be shared it with any other{' '}
          party.
        </p>
      </Well>
    );
  }
}

export default Subscription;
