const functions = require('firebase-functions');
const admin = require('firebase-admin')
const { scrape } = require('./scrapeRosters/executePuppeteer')
const { rookies2020 } = require('./scrapeRosters/rookies')

admin.initializeApp()


const now = admin.firestore.Timestamp.now()
const cronFormat = '30 4 * * *' // run every night at 04:30


const runtimeOpts = {
    timeoutSeconds: 180,
    memory: '2GB',
}

exports.updateDailyRosters = functions.runWith(runtimeOpts).pubsub.schedule(cronFormat).timeZone('Asia/Jerusalem').onRun(async (context) => {
    functions.logger.info("before", { structuredData: true });

    let dailyRoster = await scrape(rookies2020)

    let objectToSave = {
        isRookieStatusValid: dailyRoster.every(item => {
            return item.rooks.length > 0
        }),
        rosters: dailyRoster,
        time: now.toDate()
    }

    let weriteResult = await admin.firestore().collection('daily-rosters').add(objectToSave)

    functions.logger.info(weriteResult, { structuredData: true });

    functions.logger.info("after", { structuredData: true });
    return null;
})