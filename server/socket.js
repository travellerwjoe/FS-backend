const api = require('./api')

module.exports = http => {
    const io = require('socket.io')(http);
    io.on('connection', async socket => {
        console.log('connection');
        socket.emit('live', await api.getLive)
    })
}