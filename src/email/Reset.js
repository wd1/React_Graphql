import sendEmail from './Email';

function sendResetEmail(recipient) {
  const subject = 'Reset Password at IACP';
  const html = `
<h2>Hey There, </h2>

<p>
This is a confirmation that the password for your account ${recipient} has just been changed.\n
</p>`;
  sendEmail(recipient, subject, html);
}


export default sendResetEmail;
