const Koa = require('koa')
const app = new Koa()


// cors
const cors = require('@koa/cors')
app.use(cors({
  credentials: true
}))

// todo
// cookie
const { cookieMiddleware } = require('./utils/cookie')
app.use(cookieMiddleware)

// body parser
const bodyparser = require("koa-bodyparser")
app.use(bodyparser())

// file upload

// static files
// cache

app.use(async (ctx, next) => {
  console.log(ctx.url)
  await next()
})

// routes
const router = require("./routes/index")
app.use(router.routes(), router.allowedMethods())

app.listen(3003)
console.log(`🚀 app is listening on localhost:3003`)