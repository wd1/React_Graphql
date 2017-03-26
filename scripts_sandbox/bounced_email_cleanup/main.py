import mailbox
import re
import random

filename = 'bounced-norooz.mbox'
box = mailbox.mbox(filename)
messages = list(box.items())

patterns = [
    r"550 5\.4\.1 \[(.+)\]: Recipient address rejected",
    r"An error occurred while trying to deliver the mail to the following recipients:\r\n(.+)\n------=",
    r"Your message to (.+) couldn't be delivered",
    r"Your email to (.+) was NOT delivered",
    r"The following address\(es\) failed:\r\n\r\n  (.+)\r\n",
    r"Delivery has failed to these recipients or groups:\r\n\r\n.+<(.+)>",
    r"smtp; 550 5\.1\.1 <(.+)>\.\.\. User unknown",
    r"\(expanded from: <(.+)>\)",
    r"<(.+)>: cannot update mailbox",
    r"<(.+)>: Recipient address rejected",
    r"Final-Recipient: RFC822;[\s*](.+)\nAction: failed",
]
patterns = [re.compile(pattern) for pattern in patterns]

emails = []
for index, message in messages:
    email = None
    text = message.as_string()
    for pattern in patterns:
        match = re.findall(pattern, text)
        if match:
            email = match[0]
            emails.append(email)
            break
    if email:
        continue
    if random.random() > 0.99:
        print message['from']
        print message['subject']
        print text[:10000]
        raise
