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
        return this.get(apiUrl);
    }
    getMatchDetail(matchID) {
        const apiUrl = url.resolve(this.baseUrl, 'v9/race/view');
        const data = {
            race_id: matchID
        };
        return this.get(apiUrl, data)
    }
    get(url, data) {
        return this.request(url, 'get', data)
    }
    post(url, data, isSendForm) {
        return this.request(url, 'post', data, isSendAsForm)
    }
    request(url, method, data, isSendAsForm) {
        return new Promise((resolve, reject) => {
            let req;
            if (method.toLowerCase() === 'get') {
                req = request[method](url).query(data);
            } else if (method.toLowerCase() === 'post') {
                req = request[method](url).send(data);
                isSendAsForm && req.type('form');
            } else {
                throw new Error('Method should be "get/post".');
            }
            req
                .timeout(10000)
                .end((err, res) => {
                    err && console.log(err.message);
                    (res && res.text) ? resolve(res.text) : resolve('[]');
                })
        })
    }
}

module.exports = new Api();