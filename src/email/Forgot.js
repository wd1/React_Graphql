import sendEmail from './Email';

function sendForgotEmail(recipient, resetPasswordToken) {
  const subject = 'Reset Password at IACP';
  const html = `
<h4>Hi,</h4>

<p>
Someone requested a new password for your IACP account.
Please follow this link to reset your password:<br />
<a href="http://ia-cp.org/reset/${resetPasswordToken}">http://ia-cp.org/reset/${resetPasswordToken}</a>
</p>
<p>
If you didn't make this request then you can safely ignore this email.
</p>`;
  sendEmail(recipient, subject, html);
}


export default sendForgotEmail;
