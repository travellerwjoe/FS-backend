const api = require('./api');
module.exports = router => {
    router.get('/api/live', async (ctx, next) => {
        ctx.body = await api.getLive();
    })
    router.get('/api/lottery/expert/matchID/:id/page/:page', async (ctx, next) => {
        ctx.body = await api.getLotteryWithExpert(ctx.params.id, ctx.params.page)
    })
}
