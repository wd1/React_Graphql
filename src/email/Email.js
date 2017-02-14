// -*- mode: react; -*-
import nodemailer from 'nodemailer';
import ses from 'nodemailer-ses-transport';
import logger from '../core/logger.js';
import { AWSKey } from '../secrets';
import { BCC_EMAIL } from '../config';

function sendEmail(recipient, subject, html) {
  const transporter = nodemailer.createTransport(ses(AWSKey));

  transporter.sendMail({
    from: 'IACP - Iranian Americans\' Contributions Project <noreply@ia-cp.org>',
    replyTo: 'IACP - Iranian Americans\' Contributions Project <info@ia-cp.org>',
    bcc: BCC_EMAIL,
    text: `Note: This email is sent using HTML format. If you are seeing
 this message it means your email client/application is too old to support
 HTML emails. Please use more up-to-dated email client to see this message.`,

    to: recipient,
    subject,
    html,
  }, (error, response) => {
    if (error) {
      logger.error('AWS SES failed', { error });
    } else {
      logger.info('AWS SES message sent.', { recipient, message: response.message });
    }
    transporter.close();
  });
}

export default sendEmail;
