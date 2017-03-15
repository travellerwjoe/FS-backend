const api = require('./api')

module.exports = http => {
    const io = require('socket.io')(http);
    let t;
    io.on('connection', socket => {
        const clientIp = socket.conn.remoteAddress
        console.log(`+connection from ${clientIp}`)
        socket.on('fetchLive', (stopFetch) => {
            clearTimeout(t)
            async function sendLive() {
                clearTimeout(t)
                io.emit('fetchLive', JSON.parse(await api.getLive()))
                t = setTimeout(function () {
                    sendLive()
                }, 10000)
            }
            sendLive()

        })

        socket.on('disconnect', reason => {
            console.log(`-disconnect from ${clientIp} , reason : ${reason}`)
            clearTimeout(t)
            socket.disconnect(true)
        })
    })
}