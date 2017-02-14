import sendEmail from './Email';


function sendDonationEmail(recipient, amount) {
  const subject = 'Donation to IACP';
  const html = `
<h4>IACP a Nonprofit Organization</h4>
<h4>27210 Ohlone Lane, Los Altos, CA 94022</h4>
<h4>EIN:  81-2676639</h4>

<h2>Tax Donation Receipt</h2>

<p>
Thank you for your contribution of $${amount} to IACP a Nonprofit Organization.
 Your support is greatly appreciated. IACP a Nonprofit Organization is a
 501c3 nonprofit organization.

<br /><br />

Your contribution is tax-deductible to the extent allowed by law. No goods or
 services were provided in exchange for your generous financial donation.

</p>`;
  sendEmail(recipient, subject, html);
}


export default sendDonationEmail;
