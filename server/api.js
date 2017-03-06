const request = require('superagent');
const url = require('url');
const config = require('./config');

class Api {
    constructor() {
        this.baseUrl = config.ApiBaseUrl;
    }
    getLive() {
        const apiUrl = url.resolve(this.baseUrl, 'score/data');
        return new Promise((resolve, reject) => {
            request
                .get(apiUrl)
                .end((err, res) => {
                    err && console.log(err);
                    resolve(res.text);
                })
        })
    }
}

module.exports = new Api();