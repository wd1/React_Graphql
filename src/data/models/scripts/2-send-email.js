import Subscription from '../Subscription';
import { createTransport, EMAIL_BASE } from '../../../email/Email';

const sendSingleEmail = (subscriptionInstance, transporter) => {
  const recipient = subscriptionInstance.email;
  const subject = 'Happy Norooz from IACP - Iranian Americans\' Contributions Project';
  const html = `
<html>

<head></head>
<p>
Dear Friends,
<br /><br />
On behalf of the IACP team, I would like to wish you a happy Norooz. Celebrated over 3000 years on the first day of spring, Norooz is a symbol of renewal and new beginnings; a transition from the cold and dark of winter to the warmth and light of spring.
<br /><br />
IACP is in its first year of existence and we hope to shed light on the contributions of Iranian Americans to the US in an objective and systematic manner. We are using technology in a pioneering way to tackle this complex problem. We have many results to share with you, and much more work ahead of us. We hope that this endeavor will bring many benefits to this diaspora community.
<br /><br />
We hope that you will accompany and assist us on this journey. You can do so by:
<br /><br />
Visiting our website at <a href="https://ia-cp.org/">https://ia-cp.org/</a>
<br />
Liking our Facebook page at  <a href="https://www.facebook.com/IranianAmericansContributionsProject/">https://www.facebook.com/IranianAmericansContributionsProject/</a>
<br />
And spreading the word about IACP to your friends
<br /><br />
Warm Regards,
<br /><br />
Pirooz Parvarandeh
<br />
President - IACP
</p>

<img style="height:auto !important; max-width:600px !important;width: 100% !important;" src="cid:norooz_poster"/>

<p>
If you wish to unsubscribe at any time please use this
 <a href="${subscriptionInstance.unsubLink}">unsubscribe</a> link.
</p>
<p>
IACP - PO Box 520, Los Altos, Ca., 94023
</p>
`;

  const attachments = [{
    filename: 'norooz.jpg',
    path: `${__dirname}/norooz.jpg`,
    cid: 'norooz_poster',
  }];

  transporter.sendMail({
    ...EMAIL_BASE,
    to: recipient,
    bcc: null,
    subject,
    html,
    attachments,
  }, (error, response) => {
    if (error) {
      console.error('AWS SES failed', { error });
    } else {
      subscriptionInstance.norooz96 = true;
      subscriptionInstance.save();
      console.info('AWS SES message sent.', { recipient, message: response.message });
    }
  });
};


async function sendEmails() {
  const transporter = createTransport();
  //const subscriptions = await Subscription.findAll({ where: { active: true, norooz96: false } });
  //const subscriptions = await Subscription.findAll({ where: { email: 'pirooz_parvarandeh@yahoo.com' } });
  subscriptions.forEach((subscription) => sendSingleEmail(subscription, transporter));
}

sendEmails().then(() => {
  console.log('Done!');
});
