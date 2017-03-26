// IMPORTANT, this is a workaround for now
// We have to add better structure for our migrations

import Subscription from '../Subscription';
import emailsList from './emailsList';

async function removeEmails(emails) {
  for (let email of emails) {
    const rowDeleted = await Subscription.destroy({
      where: {
        email,
      },
    });
    if (rowDeleted !== 1) {
      console.log(rowDeleted, email);
    }
  }
}

removeEmails(emailsList).then(() => {
  console.log('Done!');
});
