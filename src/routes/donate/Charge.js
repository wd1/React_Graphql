// -*- mode: react; -*-
import Stripe from 'stripe';
import { STRIPESECKEY } from '../../secrets';
import sendDonationEmail from '../../email/Donation';
import logger from '../../core/logger.js';

const stripe = Stripe(STRIPESECKEY);

function handleError(err, charge) {
  logger.error('Stripe call failed', { err, charge });
}

function handleSuccess(email, amount, charge) {
  sendDonationEmail(email, amount);
  logger.info('Donation was successfully made!', { email, amount, charge });
}

async function handleRequest(req, res) {
  const email = req.body.email;
  const token = req.body.token;
  const amount = req.body.amount;
  const description = `One time donation from ${email} to IA-CP Organization.`;
  const stripeAmount = parseInt(req.body.amount, 10) * 100;

  stripe.charges.create({
    amount: stripeAmount,
    currency: 'usd',
    source: token, // obtained with Stripe.js
    description,
  }, (err, charge) => {
    if (err) {
      handleError(err, charge);
      res.status(512);
      res.json({});
    } else {
      handleSuccess(email, amount, charge);
      res.json({});
    }
  });
}

export { handleRequest };
