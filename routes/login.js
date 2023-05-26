const axios = require('axios')
const router = require('koa-router')()
const QRCode = require('qrcode')
const Cookie = require('cookie')
const qs = require('qs')
const { parseCookies } = require('../utils/cookie')

// ## 申请二维码 key
router.get('/qrcode/key', async (ctx, next) => {
  const res = await axios({
    method: 'get',
    url: 'https://passport.bilibili.com/x/passport-login/web/qrcode/generate',
  })
  ctx.body = res.data
})

// ## 根据 url 生成 qrcode
router.post('/qrcode/create', async (ctx, next) => {
  const { url } = ctx.request.body
  console.log('create qrcode of url: ', url)

  ctx.body = {
    code: 200,
    data: {
      qrimg: await QRCode.toDataURL(url)
    }
  }
})

// ## logout
router.get('/logout', async ctx => {
  const { cookie } = ctx.headers
  const cookieObj = Cookie.parse(cookie)
  const CSRF = cookieObj.bili_jct

  const res = await axios({
    method: 'post',
    url: 'https://passport.bilibili.com/login/exit/v2',
    data: qs.stringify({
      biliCSRF: CSRF
    }),
    headers: {
      cookie,
      contentType: 'application/x-www-form-urlencoded',
    }
  })
  ctx.body = res.data
})

// ## 二维码状态轮询接口
// qrcode_key, 上一个接口得到的二维码的 key
router.post('/qrcode/poll', async (ctx, next) => {
  const { key } = ctx.request.body

  const res = await axios({
    method: 'get',
    url: 'https://passport.bilibili.com/x/passport-login/web/qrcode/poll',
    params: {
      qrcode_key: key
    }
  })
  ctx.body = res.data
  // get cookie from response, set cookie to the client
  const cookies = res.headers['set-cookie']
  console.log('🔒 get cookies from bilibili', cookies)
  const parsedCookies = (ctx.state.cookies = parseCookies(cookies))
  parsedCookies?.length && parsedCookies.map(({ name, value, options }) => ctx.cookies.set(name, value, options))
})

// ## 登陆状态
router.get('/logininfo', async ctx => {
  const { cookie } = ctx.headers

  const res = await axios({
    method: 'get',
    url: 'https://api.bilibili.com/nav',
    headers: {
      cookie
    }
  })
  ctx.body = res.data
})

module.exports = router
