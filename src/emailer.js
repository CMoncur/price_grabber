module.exports = {
  sendEmail,
}

// Core Dependencies
const Chalk    = require("chalk")
const Mailer   = require("nodemailer")

// Internal Dependencies
const Defaults = require("../env/defaults")

// Send an email containing the weighted average Ethereum price to the recipient
/* Email Options Example:

{ server : "some.smtp.yeah.com",
  port : 123,
  sender : "example@example.com",
  senderPass : "somePass",
  recipient : "example@example.com"
}
*/
function sendEmail(average, emailOptions) {
  const emailText = `
    The current Ethereum price in USD is:

    $${average}

    Price is weighted by 24 hour volume of the following exchanges:

    GDAX
    Kraken
    Gemini
  `

  const transporter = Mailer.createTransport({
    host : emailOptions.server,
    port : emailOptions.port,
    secure : emailOptions.port === 465 ? true : false,
    auth : {
      user : emailOptions.sender,
      pass : emailOptions.senderPass,
    },
  })

  const email = {
    from: emailOptions.sender,
    to: emailOptions.recipient,
    subject: Defaults.EMAIL_SUBJECT,
    text: emailText,
  }

  transporter.sendMail(email, (err, res) => {
    if (err) {
      console.log(Chalk.yellow.bold("There was an error sending the email:"))
      console.log(Chalk.yellow(err))
    }

    else {
      console.log(Chalk.green.bold("Email sent:"))
      console.log(Chalk.green(res.response))
    }
  })
}
