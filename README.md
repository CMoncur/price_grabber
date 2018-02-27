# price_grabber
Grabs ETH price daily and emails it to supplied email address daily at noon.

## Using price_grabber
First, install dependencies:

`npm install`

price_grabber expects three command line arguments in the form of:
- Sender Email Address
- Sender Email Password
- Recipient Email Address

The command line arguments must be passed in _that order_.

Start the service thusly:

`npm start sender@email.com senderpass recipient@email.com`
