const axios = require('axios')
const router = require('koa-router')()

// https://mall.bilibili.com/mall/noah/search/category/v2

// todo
router.get('', async ctx => {
  const { cookie } = ctx.headers
  const { uid, offsetId } = ctx.query

  const res = await axios({
    method: 'post',
    url: 'https://mall.bilibili.com/mall/noah/search/category/v2',
    data: {
      keyword: "",
      filters: "",
      priceFlow: "",
      priceCeil: "",
      sortType: "totalrank",
      sortOrder: "",
      pageIndex: 1,
      userId: "",
      state: "",
      scene: "PC_list",
      termQueries: [
        {
          field: "category",
          value: "1_109"
        },
        {
          field: "sale_type",
          values: ["0", "2", "6", "7"]
        },
        {
          field: "2",
          values: [
            "0_3000392"
          ]
        },
        {
          field: "4",
          values: ["0"]
        },
        {
          field: "sold_status",
          values: ["1"]
        }
      ],
      rangeQueries: [],
      pageSize: 32,
      from: "pc_show",
      msource: ""
    },
    headers: {
      cookie
    },
  })
  ctx.body = res.data
})

module.exports = router
