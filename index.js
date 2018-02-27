const Axios    = require("axios")
const Chalk    = require("chalk")
const Cron     = require("cron").CronJob
const Defaults = require("./env/defaults")


// console.log(Chalk.yellow.bold("TRAINING"))
// console.log(Chalk.yellow("Inputs: ", JSON.stringify(neuralNetInput)))
// console.log(Chalk.yellow("Outputs: ", JSON.stringify(neuralNetOutput())))

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
      krakenApiRes.data.result.XETHZUSD.c[0],
      geminiApiRes.data.volume.ETH
    ],
  }
}

/* CRON */
// Base cron settings
const cronSettings = {
  cronTime: "0 * * * * *", // First second of every minute of every hour of ...
  onTick: fetchData,
  start: false,
}

// Cron for fetching ticker data
const app = new Cron(cronSettings)

/* APPLICATION */
// Start the cron
app.start()
