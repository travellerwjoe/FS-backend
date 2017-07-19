const request = require('superagent')
const url = require('url');
const Api = require('../server/api')
const fs = require('fs')
const path = require('path')
const utils = require('../server/utils')

module.exports = function (args) {
    class LotteryDSApi extends Api {
        constructor() {
            super()
        }
        getNotable(page = 1) {
            const apiUrl = url.resolve(this.baseUrl, '/v4/jingcai/mingren')
            const data = {
                page: page,
                per_page: this.pageSize,
                token: this.token,
                next: 1
            }
            return this.get(apiUrl, data)
        }
    }

    class LotteryDS {
        constructor() {
            this.api = new LotteryDSApi()
            this.lottery = []
            this.notable()
        }
        async notable(page = 1) {
            let allPage, allCount, lotteryObj = {}, lotteryOriginArr = []
            await async function each() {
                const res = JSON.parse(await this.api.getNotable(page))
                allPage = Math.ceil(res.total / this.api.pageSize),
                    allCount = res.total
                lotteryOriginArr.push(res)
                res.jingcai.forEach((item, index) => {
                    // if (item.type !== 'rangfen') return false
                    const obj = {
                        matchID: item.race.id,
                        league: item.race.league.name,
                        match: `${item.race.host.name}-${item.race.guest.name}`,
                        racetime: utils.formatDateTime(item.race.race_time * 1000, 'yyyy-MM-dd hh:mm', true),
                        jingcai: {}
                    }, matchID = item.race.id, type = item.type, pankou = item.pankou, yazhu = item.yazhu
                    if (!lotteryObj[obj.matchID]) {
                        lotteryObj[obj.matchID] = obj
                    }
                    if (!lotteryObj[matchID].jingcai[type]) {
                        lotteryObj[matchID].jingcai[type] = {}
                    }
                    if (!lotteryObj[matchID].jingcai[type][pankou]) {
                        lotteryObj[matchID].jingcai[type][pankou] = {}
                        // console.log(obj.jingcai[pankou])
                        /*lotteryObj[matchID].jingcai[pankou] = {
                            gt: 0,
                            lt: 0
                        }*/
                    }
                    if (!lotteryObj[matchID].jingcai[type][pankou][yazhu]) {
                        lotteryObj[matchID].jingcai[type][pankou][yazhu] = 1
                    } else {
                        lotteryObj[matchID].jingcai[type][pankou][yazhu]++
                    }
                    /*if (yazhu === 'gt') {
                        lotteryObj[matchID].jingcai[pankou].gt++
                    } else if (yazhu === 'lt') {
                        lotteryObj[matchID].jingcai[pankou].lt++
                    }*/
                })
                if (page <= allPage) {
                    page++
                    await each.call(this)
                }
            }.call(this)
            const date = (() => {
                const now = new Date(),
                    year = now.getFullYear(),
                    month = now.getMonth() + 1,
                    day = now.getDate()
                return `${year}${month < 10 ? '0' + month : month}${day < 10 ? '0' + day : day}`
            })()
            for (var key in lotteryObj) {
                this.lottery.push(lotteryObj[key])
            }
            this.lottery.sort((cur, pre) => {
                return new Date(cur.racetime).valueOf() - new Date(pre.racetime).valueOf()
            })
            console.log(`共有${allCount}条竞猜`)
            fs.writeFile(path.join(__dirname, 'lottery', `lottery${date}.json`), JSON.stringify(this.lottery, null, 4), err => {
                err && console.log(err)
            })
            fs.writeFile(path.join(__dirname, 'lottery', `lottery${date}-origin.json`), JSON.stringify(lotteryOriginArr, null, 4), err => {
                err && console.log(err)
            })
        }
    }

    new LotteryDS()
}