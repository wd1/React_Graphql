// IMPORTANT, this is a workaround for now
// We have to add better structure for our migrations

import Subscription from '../Subscription';
import emailsList from './emailsList';

async function addEmails(emails) {
  for (let email of emails) {
    await Subscription.findOrCreate({ where: { email } });
  }
}

const emails = emailsList;


addEmails(emails).then(() => {
  console.log('Done!');
});
