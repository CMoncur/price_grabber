# price_grabber
Grabs ETH price daily from multiple sources, calculates a weighted average of the price by 24 hour volume, and emails it to supplied email address daily at noon.

## Using price_grabber
First, install dependencies:

`npm install`

price_grabber expects five command line arguments in the form of:
- SMTP Server URL
- Port
- Server Username
- Server Password
- Recipient Email Address

The command line arguments must be passed in _that order_.

Start the service thusly:

`npm start some.smtp.server.com 465 smtp-username smtp-pass recipient@email.com`

As an aside, if the password supplied to the command line contains special characters, they will need to be escaped. For instance, if the password supplied is `hello!$`, it will have to be passed to the command line as `hello\!\$`

## Example Email
```
The current Ethereum price in USD is:

    $875.83

    Price is weighted by 24 hour volume of the following exchanges:

    GDAX
    Kraken
    Gemini
```
