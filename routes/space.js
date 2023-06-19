const axios = require('axios')
const router = require('koa-router')()
const { encWbi } = require('../utils/wbi')

// ## 用户动态
// host_uid, user's id
router.get('/space/dynamics', async ctx => {
  const { cookie } = ctx.headers
  const { uid, offsetId } = ctx.query

  const res = await axios({
    method: 'get',
    url: 'https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/space_history',
    params: {
      need_top: 1,
      host_uid: uid,
      offset_dynamic_id: offsetId
    },
    headers: {
      cookie
    },
  })
  ctx.body = res.data
})

// todo
// ## 用户投稿视频
// !! Wbi required
// https://socialsisteryi.github.io/bilibili-API-collect/docs/misc/sign/wbi.html#wbi%E7%AD%BE%E5%90%8D%E7%AE%97%E6%B3%95
// mid {Number}, required, user's id
// w_id {String}, required, Wbi 签名
// wts {Number}, required, Wbi 当前时间戳
// order {String}, sort order, pubdate (default)| click | stow 收藏
// tid {Number}, 0 (default), 分区 id, 筛选目标分区
// keyword {String}, 关键词筛选
// pn {Number}, page number
// ps {Number}, page size, 30 (default), [1, 50]
router.get('/space/videos', async ctx => {
  const { cookie } = ctx.headers
  // const {
  // query
  // } = ctx.request.body

  const {
    mid,
    order,
    tid,
    keyword,
    pn,
    ps,
    // w_id,
    // wts,
    // gaia_source: "m_station",
    // platform: "h5",
    // query
  } = ctx.query

  const query = encWbi(ctx.query)
  console.log(query)

  const res = await axios({
    method: 'get',
    url: 'https://api.bilibili.com/x/space/wbi/arc/search' + `?${query}`,
    headers: {
      cookie,
    },
  })
  ctx.body = res.data
})

module.exports = router
