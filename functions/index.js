const functions = require('firebase-functions');
const { scrape } = require('./scrapeRosters/executePuppeteer')

// const now = admin.firestore.Timestamp.now()
const cronFormat = '30 * * * *' // run every night at 04:30


const runtimeOpts = {
    timeoutSeconds: 180,
    memory: '2GB',
}

exports.updateDailyRosters = functions.runWith(runtimeOpts).pubsub.schedule(cronFormat).timeZone('Asia/Jerusalem').onRun(async (context)=> {
    console.log('before')
    functions.logger.info("before", { structuredData: true });

    let dailyRoster = await scrape()
    console.log('dailyRoster', dailyRoster)

    console.log('after')
    functions.logger.info("after", { structuredData: true });
    return null;
})