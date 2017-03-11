const api = require('./api')

module.exports = http => {
    const io = require('socket.io')(http);
    let t;
    io.on('connection', socket => {
        socket.on('fetchLive', socket => {
            async function sendLive() {
                clearTimeout(t)
                io.emit('live', JSON.parse(await api.getLive()))
                t = setTimeout(function () {
                    sendLive()
                },5000)
            }
            sendLive()
        })
    })
}