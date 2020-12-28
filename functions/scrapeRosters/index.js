require('dotenv').config()
const { executePuppeteer } = require('./executePuppeteer')

executePuppeteer()
    .then((currentRecord) => {
        // console.log('currentRecord', currentRecord)
        return currentRecord
        // // const savedDoc = await db.collection('manual-scrape-dates').add({
        // //     date: ,
        // //     teams: currentRecord
        // // });

        // console.log('savedDoc', savedDoc)

    }).catch((err) => {
        console.log('err', err)
    })
