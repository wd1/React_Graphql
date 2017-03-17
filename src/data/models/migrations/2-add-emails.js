// IMPORTANT, this is a workaround for now
// We have to add better structure for our migrations

import Subscription from '../Subscription';


async function addEmails(emails) {
  for (let email of emails) {
    await Subscription.findOrCreate({ where: { email } });
  }
}

const emails = [
  'hamed.ty@gmail.com',
];

addEmails(emails).then(() => {
  console.log('Done!');
});
