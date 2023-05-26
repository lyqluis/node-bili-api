const router = require('koa-router')()
const axios = require('axios')
const { REGIONS } = require('../utils/channel')

// ## 分区动态
// rid - 分区 id, (required)
// ps - page size, default: 5
// pn - page number, default: 1
// https://api.bilibili.com/x/web-interface/dynamic/region?ps=12&pn=1&rid=36
// rid && day = 7, 分区 7 日热门
// rid && (pn || ps), 分区最新视频
router.get('/region', async (ctx, next) => {
  const { query, querystring } = ctx
  const { ps, pn, rid } = query

  if (querystring) {
    // todo no rid, return 404
    const res = await axios({
      url: `https://api.bilibili.com/x/web-interface/dynamic/region`,
      params: {
        rid,
        pn,
        ps,
      }
    })
    ctx.body = res.data
  } else {  // ## 所有分区 rid
    ctx.body = {
      code: 200,
      data: REGIONS,
    }
  }

})

module.exports = router