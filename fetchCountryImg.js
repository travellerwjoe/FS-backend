const fs = require('fs');
const request = require('superagent');

for (let i = 1; i <= 226; i++) {
    request.get(`https://s.dorics.com/country/m/${i}.png`)
        .end((err, res) => {
            fs.writeFile(`img/${i}.png`, res.body, (err, res) => {
                err && cosole.log(err);
            })
        })
}