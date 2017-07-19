const Api = require('./api')
const config = require('./config')

const api = new Api();
module.exports = http => {
    const io = require('socket.io')(http);
    let t;
    io.on('connection', socket => {
        const clientIp = socket.conn.remoteAddress
        console.log(`+connection from ${clientIp}`)
        socket.on('fetchLive', (isStop) => {
            clearTimeout(t)
            console.log(t)
            console.log(isStop)
            async function sendLive() {
                console.log('jjjj')
                clearTimeout(t)
                io.emit('fetchLive', JSON.parse(await api.getLive()))
                t = setTimeout(function () {
                    sendLive()
                }, config.SocketSendInterval)
            }
            !isStop && sendLive()

        })


        socket.on('fetchMatchDetail', (matchID) => {
            clearTimeout(t)
            async function sendLive() {
                clearTimeout(t)
                io.emit('fetchMatchDetail', JSON.parse(await api.getMatchDetail(matchID)))
                t = setTimeout(function () {
                    sendLive()
                }, 15000)
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