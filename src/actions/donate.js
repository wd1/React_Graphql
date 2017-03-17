// -*- mode: react; -*-
import {
  DONATE_REQUEST, DONATE_SUCCESS, DONATE_FAILURE,
  SETPUBLISHABLEKEY_REQUEST, SETPUBLISHABLEKEY_SUCCESS, SETPUBLISHABLEKEY_FAILURE,
  CREATETOKEN_REQUEST, CREATETOKEN_SUCCESS, CREATETOKEN_FAILURE,
  RESET_SUCCESS,
} from '../constants/donate';

/**
 * donate actions
 */
function donateRequest() {
  return {
    type: DONATE_REQUEST,
  };
}

function donateSuccess() {
  return {
    type: DONATE_SUCCESS,
  };
}

function donateFailure(errors) {
  return {
    type: DONATE_FAILURE,
    payload: {
      errors,
    },
  };
}

export function donate(amount) {
  return async (dispatch, getState, { graphqlRequest }) => {
    dispatch(donateRequest());

    const state = getState().donate;

    const token = state.token;
    const contact = state.contact;
    const email = contact.email.value;
    const fullName = contact.fullName.value;
    const zipCode = contact.zipCode.value;
    const announceName = contact.announceName;
    const announceAmount = contact.announceAmount;

    try {
      const { data } = await graphqlRequest(`
        mutation {
          donate(token: "${token}",
                 email: "${email}",
                 fullName: "${fullName}"
                 zipCode: "${zipCode}"
                 amount: ${amount}
                 announceName: ${announceName}
                 announceAmount: ${announceAmount}
          ) {
            errors { key, message }
          }
        }
      `);

      const { errors } = data.donate;

      if (errors.length > 0) {
        dispatch(donateFailure(errors));
      } else {
        dispatch(donateSuccess());
      }
    } catch (e) {
      const errors = [
        {
          key: 'general',
          message: 'Unexpected server error',
        },
      ];
      dispatch(donateFailure(errors));
    }
  };
}

/**
 * setPublishableKey actions
 */
function setPublishableKeyRequest() {
  return {
    type: SETPUBLISHABLEKEY_REQUEST,
  };
}

function setPublishableKeySuccess() {
  return {
    type: SETPUBLISHABLEKEY_SUCCESS,
  };
}

function setPublishableKeyFailure(errors) {
  return {
    type: SETPUBLISHABLEKEY_FAILURE,
    payload: {
      errors,
    },
  };
}

export function setPublishableKey(stripeSetPublishableKey, STRIPEPUBKEY) {
  return async (dispatch) => {
    dispatch(setPublishableKeyRequest());
    try {
      await stripeSetPublishableKey(STRIPEPUBKEY);
      dispatch(setPublishableKeySuccess());
    } catch (e) {
      const errors = [
        {
          key: 'general',
          message: 'Unexpected server error',
        },
      ];
      dispatch(setPublishableKeyFailure(errors));
    }
  };
}

/**
 * createToken actions
 */
function createTokenRequest() {
  return {
    type: CREATETOKEN_REQUEST,
  };
}

function createTokenSuccess(token, contact) {
  return {
    type: CREATETOKEN_SUCCESS,
    payload: {
      token,
      contact,
    },
  };
}

function createTokenFailure(errors) {
  return {
    type: CREATETOKEN_FAILURE,
    payload: {
      errors,
    },
  };
}


export function createToken(stripeCreateToken, card, contact) {
  return async (dispatch) => {
    dispatch(createTokenRequest());
    try {
      const errors = [];

      await stripeCreateToken(card, async (status, response) => {
        if (response.error) {
          errors.push({
            key: 'stripe',
            message: response.error.message,
          });
        } else if (status !== 200) {
          errors.push({
            key: 'stripe',
            message: 'Unexpected error while communicating with Stripe server!',
          });
          // Stripe Request Error, more generic
        }
        const token = response.id;

        if (errors.length > 0) {
          dispatch(createTokenFailure(errors));
        } else {
          dispatch(createTokenSuccess(token, contact));
        }
      });
    } catch (e) {
      const errors = [
        {
          key: 'general',
          message: 'Unexpected server error',
        },
      ];
      dispatch(createTokenFailure(errors));
    }
  };
}

function resetSuccess() {
  return {
    type: RESET_SUCCESS,
  };
}

export function reset() {
  return async (dispatch) => {
    dispatch(resetSuccess());
  };
}
