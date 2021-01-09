require('dotenv').config()
const puppeteer = require('puppeteer');
const leagueId = process.env.LEAGUE_ID || ''
const rostersUrl = `https://fantasy.espn.com/basketball/league/rosters?leagueId=${leagueId}&seasonId=2021`;
const matchupUrl = `https://fantasy.espn.com/basketball/league/scoreboard?leagueId=${leagueId}`

const executePuppeteer = async (rookies) => {

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox','--disable-setuid-sandbox']
    });

    
    const rosterPage = await browser.newPage();

    await rosterPage.goto(rostersUrl, {
        waitUntil: 'networkidle0',
    });

    const rosters = await rosterPage.evaluate((rookies) => {

        let teamElement = Array.prototype.slice.call(document.getElementsByClassName('ResponsiveTable'))

        // console.log('teamElement', teamElement)
        return teamElement.map((teamEl) => {
            let rosterTable = teamEl.querySelector('.Table__TBODY')
            let rosterList = Array.prototype.slice.call(rosterTable.getElementsByClassName('player-column__athlete'))
            // console.log('rosterTable', rosterTable)
            // console.log('rosterList', rosterList)
            let roster = rosterList.map(tr => {
                // console.log(tr)
                return tr.title
            })
            return {
                team: teamEl.querySelector('.teamName').title,
                roster,
                rooks: roster.filter(player => {
                    return rookies[player]
                })

            }
        })

    },rookies);

    rosterPage.close()



    const matchupPage = await browser.newPage();
    await matchupPage.goto(matchupUrl, {
        waitUntil: 'networkidle0',
    });

    const matchup = await matchupPage.evaluate(() => {
        const currentMatchupEl = [...document.getElementsByClassName('dropdown__select')][0]
        const currentMatchupValue = currentMatchupEl.value;
        const options = [...currentMatchupEl.children]
        const currentOptionEl = options.filter(item=>item.value===currentMatchupValue)[0]
        return currentOptionEl.innerText
    });

    console.log(rosters)
    await browser.close()

    if (rosters) return {rosters,matchup}

}




module.exports.scrape = executePuppeteer;