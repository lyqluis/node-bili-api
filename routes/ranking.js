const router = require('koa-router')()
const axios = require('axios')
const { RANK_REGIONS } = require('../utils/channel')

router.get('/ranking_channels', async (ctx, next) => {
  ctx.body = {
    code: 200,
    data: RANK_REGIONS,
  }
})


/**
 * 排行榜
 * rid 不写为总榜
 */
router.get('/ranking', async (ctx, next) => {
  const { rid } = ctx.query

  const res = await axios({
    url: 'https://api.bilibili.com/x/web-interface/ranking/v2',
    method: 'get',
    params: { rid }
  })
  ctx.body = res.data
})

/**
 * 分区排行
 * rid, required
 */
router.get('/region_ranking', async (ctx, next) => {
  const { rid, day, context } = ctx.query

  const res = await axios({
    url: 'https://api.bilibili.com/x/web-interface/ranking/region',
    method: 'get',
    params: {
      rid,
      day,
      context
    }
  })
  ctx.body = res.data
})

module.exports = router
