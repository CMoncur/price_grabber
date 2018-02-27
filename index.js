const Axios    = require("axios")
const Chalk    = require("chalk")
const Cron     = require("cron").CronJob
const Defaults = require("./env/defaults")


// console.log(Chalk.yellow.bold("TRAINING"))
// console.log(Chalk.yellow("Inputs: ", JSON.stringify(neuralNetInput)))
// console.log(Chalk.yellow("Outputs: ", JSON.stringify(neuralNetOutput())))

const fetchData = async () => {
  const gdaxApiRes = await Axios.get(Defaults.GDAX_API_URL)
  const krakenApiRes = await Axios.get(Defaults.KRAKEN_API_URL)
  const geminiApiRes = await Axios.get(Defaults.GEMINI_API_URL)

  console.log(gdaxApiRes)
  console.log(krakenApiRes)
  console.log(geminiApiRes)
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
