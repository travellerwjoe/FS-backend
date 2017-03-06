const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
const router = new Router();

app.use(async (ctx, next) => {
    ctx.set({
        'Access-Control-Allow-Origin': '*'
    })
    await next();
})

app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
})

require('./router')(router);

app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (ctx, res) => {
    ctx.body = 'hello FS';
})

app.listen(5555);