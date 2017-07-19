const Api = require('./api');
const api = new Api();
module.exports = router => {
    router.get('/api/live', async (ctx, next) => {
        ctx.body = await api.getLive();
    })
    router.get('/api/lottery/expert/matchID/:id/page/:page', async (ctx, next) => {
        ctx.body = await api.getLotteryWithExpert(ctx.params.id, ctx.params.page)
    })
    router.get('/api/comments/matchID/:id/page/:page', async (ctx, next) => {
        ctx.body = await api.getMatchComments(ctx.params.id, ctx.params.page)
    })
    router.get('/api/login', async (ctx, next) => {
        ctx.body = await api.login()
        // console.log(ctx.session)
    })
}
