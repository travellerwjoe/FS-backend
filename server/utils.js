var crypto = require('crypto')

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
    }
}