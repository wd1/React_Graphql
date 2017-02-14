import sendEmail from './Email';

function sendRegistrationEmail(recipient) {
  const subject = 'Registration at IACP';
  const html = `
<h2>Welcome,</h2>

<p>
You're successfully registered in IACP (Iranian-Americans Contributions Project) website.
<br /><br />
Thank you,
<br />
IACP
</p>`;
  sendEmail(recipient, subject, html);
}


export default sendRegistrationEmail;
