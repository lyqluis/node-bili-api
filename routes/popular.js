const axios = require('axios')
const router = require('koa-router')()

// ## 热门
// ps - page size, default: 20
// pn - page number, default: 1
router.get('/popular', async (ctx, next) => {
  const { query } = ctx
  const { pn, ps } = query

  const res = await axios({
    method: 'get',
    url: 'https://api.bilibili.com/x/web-interface/popular',
    params: {
      pn,
      ps
    }
  })
  ctx.body = res.data
  await next()
})

// ## 每周必看
// numer - 期数，不填默认返回第 1 期，2019/3.22(fri)-3.28(thu)
// 每周五晚 18:00 更新
router.get('/weekly', async (ctx, next) => {
  const { number } = ctx.query

  const res = await axios({
    method: 'get',
    url: 'https://api.bilibili.com/x/web-interface/popular/series/one',
    params: {
      number
    }
  })
  ctx.body = res.data
})

// ## 往期每周必看
router.get('/weeklylist', async (ctx, next) => {
  const res = await axios({
    method: 'get',
    url: 'https://api.bilibili.com/x/web-interface/popular/series/list',
  })
  ctx.body = res.data
})

// ## 入站必刷
// page_size=100
// page=1
// 不写参数也同样返回入站必刷 100 个视频（可能没有 100 个了，目前是 85 个）
router.get('/mustseeall', async (ctx, next) => {
  const { page_size, page } = ctx.query

  const res = await axios({
    method: 'get',
    url: 'https://api.bilibili.com/x/web-interface/popular/precious',
    params: {
      page_size: page_size ?? 100,
      page: page ?? 1
    }
  })
  ctx.body = res.data
})


module.exports = router
