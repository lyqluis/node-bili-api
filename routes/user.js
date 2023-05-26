const axios = require('axios')
const router = require('koa-router')()

// ## 用户状态数值
// vmid, user's mid
router.get('/userstat', async (ctx, next) => {
  const { cookie } = ctx.headers
  const { vmid } = ctx.query

  const res = await axios({
    method: 'get',
    url: 'https://api.bilibili.com/x/relation/stat',
    params: {
      vmid
    },
    headers: {
      cookie
    },
  })
  ctx.body = res.data
})


// ## 用户创建的所有收藏夹
// mid, user's mid
router.get('/user_favorites', async ctx => {
  const { cookie } = ctx.headers
  const { mid } = ctx.query

  const res = await axios({
    method: 'get',
    url: 'https://api.bilibili.com/x/v3/fav/folder/created/list-all',
    params: {
      up_mid: mid
    },
    headers: {
      cookie
    },
  })
  ctx.body = res.data
})

// ## 收藏夹信息
// media_id, 收藏夹 id
router.get('/fav_info', async ctx => {
  const { cookie } = ctx.headers
  const { media_id } = ctx.query

  const res = await axios({
    method: 'get',
    url: 'https://api.bilibili.com/x/v3/fav/folder/info',
    params: {
      media_id,
    },
    headers: {
      cookie
    },
  })
  ctx.body = res.data
})

// ## 观看历史记录
// - max {Number}, 历史记录截止目标 id	非必要	默认为 0
//   稿件：稿件 avid
//   剧集（番剧 / 影视）：剧集 ssid
//   直播：直播间 id
//   文集：文集 rlid
//   文章：文章 cvid
// - business {String}, 历史记录截止目标业务类型	非必要	默认为空
//   archive：稿件
//   pgc：剧集（番剧 / 影视）
//   live：直播
//   article-list：文集
//   article：文章
// - view_at {Number}, 历史记录截止时间	非必要	时间戳
//   默认为 0
//   0 为当前时间
// - type {String}, 历史记录分类筛选	非必要	all：全部类型（默认）
//   archive：稿件
//   live：直播
//   article：文章
// - ps	{Number}, 每页项数	非必要	默认为 20，最大 30
router.get('/user_history', async ctx => {
  const { cookie } = ctx.headers
  const { max, business, view_at, type, ps } = ctx.query

  const res = await axios({
    method: 'get',
    url: 'https://api.bilibili.com/x/web-interface/history/cursor',
    params: {
      max,
      business,
      view_at,
      type,
      ps,
    },
    headers: {
      cookie
    },
  })
  ctx.body = res.data
})

module.exports = router
