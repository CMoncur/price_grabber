// Core Dependencies
const Axios    = require("axios")
const Cron     = require("cron").CronJob

// Internal Dependencies
const Defaults = require("./env/defaults")
const Emailer  = require("./src/emailer")
const Util     = require("./src/util")

// Command Line Arguments
const ARGS = process.argv.slice(2) // Strips NodeJS base args

// Base Email Options
const EMAIL_OPTIONS = {
  sender : ARGS[0],
  senderPass : ARGS[1],
  recipient : ARGS[2],
}

const fetchData = async () => {
  /* Example GDAX Response:

  { trade_id: 29834142,
  price: '876.84000000',
  size: '1.05870000',
  bid: '876.83',
  ask: '876.84',
  volume: '68327.54541271',
  time: '2018-02-27T19:58:51.186000Z' }
  */
  const gdaxApiRes = await Axios.get(Defaults.GDAX_API_URL)

  /* Example Kraken Response:

  { error: [],
  result:
   { XETHZUSD:
      { a: [Array],
        b: [Array],
        c: [Array],
        v: [Array],
        p: [Array],
        t: [Array],
        l: [Array],
        h: [Array],
        o: '866.62000' } } }
  */
  const krakenApiRes = await Axios.get(Defaults.KRAKEN_API_URL)

  /* Example Gemini Response:

  { bid: '876.77',
  ask: '876.78',
  volume:
   { ETH: '26517.10203527',
     USD: '23136896.9052454319',
     timestamp: 1519761300000 },
  last: '876.78' }
  */
  const geminiApiRes = await Axios.get(Defaults.GEMINI_API_URL)

  const healthyResponse = [
    gdaxApiRes.status,
    krakenApiRes.status,
    geminiApiRes.status
  ].every((x) => x === 200)

  if (!healthyResponse) {
    return {
      status: 500,
      prices: [],
      volumes: [],
    }
  }

  return {
    status: 200,
    prices: [
      gdaxApiRes.data.price,
      krakenApiRes.data.result.XETHZUSD.c[0],
      geminiApiRes.data.last
    ],
    volumes: [
      gdaxApiRes.data.volume,
      krakenApiRes.data.result.XETHZUSD.v[1],
      geminiApiRes.data.volume.ETH
    ],
  }
}

const parseData = async () => {
  const res = await fetchData()

  if (!res.status === 200) {
    const errMsg = `
      One or more of the API calls resulted in a bad response.
    `

    throw new Error(errMsg)
  }

  const prices = res.prices
    .map((x) => Number(x))
    .filter((x) => Util.isNum(x))

  const volumes = res.volumes
    .map((x) => Number(x))
    .filter((x) => Util.isNum(x))

  if (prices.length !== volumes.length) {
    const errMsg = `
      Cannot calculate weighted average when there are an inconsistent number
      of prices and volumes. This is likely indicative of a breaking API change
      in one of the APIs. Updating parsing logic accordingly should resolve
      this issue.
    `

    throw new Error(errMsg)
  }

  Emailer.sendEmail(Util.weightedAverage(prices, volumes), EMAIL_OPTIONS)
}

/* CRON */
// Base cron settings
const cronSettings = {
  cronTime: "0 0 12 * * *", // Every day at noon
  onTick: parseData,
  start: false,
}

// Cron for fetching ticker data
const app = new Cron(cronSettings)

/* APPLICATION */
// Start the cron
if (ARGS.length !== 3) {
  const errMsg = `
    Incorrect number of arguments passed to price_grabber. Expecting three
    arguments in the form of:

    1. Sender Email Address (expects Gmail address)
    2. Sender Email Password
    3. Recipient Email Address

    Example:
    npm start sender@email.com secretpass recipient@email.com

    Note:
    Special characters in passwords will need to be escaped.
  `

  throw new Error(errMsg)
}

else {
  app.start()
}
