import sendEmail from './Email';


function sendSubscriptionEmail(subscriptionInstance) {
  const recipient = subscriptionInstance.email;
  const subject = 'IACP Newsletter Subscription';
  const html = `<p>
Hi,
<br /><br />
Your email address has been successfully added to our mailing list. We send out occasional emails on IACP updates.
<br />
If you wish to unsubscribe at any time please use this
 <a href="${subscriptionInstance.unsubLink}">unsubscribe</a> link.
<br /><br />
Thank you,
<br />
IACP
</p>
`;

  sendEmail(recipient, subject, html);
}


export default sendSubscriptionEmail;
