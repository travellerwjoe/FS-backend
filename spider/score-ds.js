/**
 * 根据某日的json数据获取比分
 */
const fs = require('fs')
const path = require('path')
const url = require('url')
const asy = require('async')
const Api = require('../server/api')

module.exports = function (args) {
    const [date] = args
    class ScoreDSApi extends Api {
        constructor() {
            super()
        }
        //获取某日的比赛数据
        getDiary(date, page = 1) {
            console.log('getDiary')
            const apiUrl = url.resolve(this.baseUrl, '/v6/diary')
            const data = {
                page: page,
                per_page: this.pageSize,
                day: date,
                last: ''
            }
            return this.post(apiUrl, data, true)
        }
    }
    class ScoreDS {
        constructor() {
            this.api = new ScoreDSApi()
            this.scores = []
            this.init()
        }
        async init() {
            console.time('getAllScores')
            await this.getAllScores()
            console.timeEnd('getAllScores')
            this.scoreForLottery()
        }
        async getAllScores(page = 1) {
            let allPage, allCount
            // asy.each()
            await async function each() {
                console.log(page)
                const res = JSON.parse(await this.api.getDiary(date, page))
                // console.log(date)
                // fs.writeFile(path.join(__dirname, 'lottery', 'test.json'), JSON.stringify(res, null, 4))
                allPage = Math.ceil(res.total / this.api.pageSize),
                    allCount = res.total
                res.races.forEach((item, index) => {
                    const race = item.race_end
                    if (!race) return
                    this.scores.push({
                        matchID: item.id,
                        score: `${race.host_goal}-${race.guest_goal}`,
                        corner: `${race.host_corner}-${race.guest_corner}`
                    })
                })
                if (page <= allPage) {
                    page++
                    await each.call(this)
                }
            }.call(this)
            console.log(this.scores)
        }
        scoreForLottery() {
            const file = path.join(__dirname, 'lottery', `lottery${date}.json`)
            const file2 = path.join(__dirname, 'lottery', `lottery${date}_bak.json`)
            const lotterys = require(file)
            const scores = this.scores.slice(0)
            console.time('each')
            lotterys.forEach((lottery, i) => {
                scores.forEach((score, n) => {
                    if (lottery.matchID === score.matchID) {
                        lottery.score = score.score
                        lottery.corner = score.corner
                        scores.splice(n, 1)
                    }
                })
            })
            console.log(lotterys)
            fs.writeFile(file2, JSON.stringify(lotterys, null, 4))
            console.timeEnd('each')
        }
    }
    new ScoreDS()
}