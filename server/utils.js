var crypto = require('crypto')
var fs = require('fs')
var path = require('path')

module.exports = {
    hash(type, message) {
        const md5 = crypto.createHash(type)
        md5.update(message)
        return md5.digest('hex')
    },
    md5(message) {
        return this.hash('md5', message)
    },
    sha1(message) {
        return this.hash('sha1', message)
    },
    saveToken(token) {
        console.log('saveToken', token)
        fs.writeFile(path.resolve(__dirname, 'token.json'), JSON.stringify({ token: token }, null, 4), (err, res) => {
            err && console.log(err.message)
            console.log('writed')
        })
    },
    formatDateTime(datetime, fmt, getUTC) {
        datetime = new Date(datetime)
        if (getUTC) {
            datetime.getMonth = datetime.getUTCMonth
            datetime.getDate = datetime.getUTCDate
            datetime.getHours = datetime.getUTCHours
            datetime.getSeconds = datetime.getUTCSeconds
            datetime.getMilliseconds = datetime.getUTCMilliseconds
            datetime.getFullYear = datetime.getUTCFullYear
        }
        var o = {
            'M+': datetime.getMonth() + 1, // 月份 
            'd+': datetime.getDate(), // 日 
            'h+': datetime.getHours(), // 小时 
            'm+': datetime.getMinutes(), // 分 
            's+': datetime.getSeconds(), // 秒 
            'q+': Math.floor((datetime.getMonth() + 3) / 3), // 季度 
            'S': datetime.getMilliseconds() // 毫秒 
        }
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (datetime.getFullYear() + '').substr(4 - RegExp.$1.length))
        for (var k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
        return fmt
    }
}