const api = require('./api');
module.exports = router => {
    router.get('/api/live', async (ctx, next) => {
        ctx.body = await api.getLive();
    })
}
