const request = require('superagent');
const url = require('url');
const config = require('./config');

class Api {
    constructor() {
        this.baseUrl = config.ApiBaseUrl;
    }
    getLive() {
        // const apiUrl = url.resolve(this.baseUrl, 'score/data');
        const apiUrl = url.resolve(this.baseUrl, 'v6/score');
        return new Promise((resolve, reject) => {
            request
                .get(apiUrl)
                .end((err, res) => {
                    err && console.log(err.message);
                    (res && res.text) ?resolve(res.text): resolve('[]');
                })
        })
    }
}

module.exports = new Api();