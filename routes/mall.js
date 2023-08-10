const axios = require('axios')
const router = require('koa-router')()

// ## app 会员购首页信息
router.get('/mall/index', async ctx => {
  const res = await axios({
    method: 'get',
    // url: 'https://mall.bilibili.com/mall-c-search/home/index/v2?appkey=27eb53fc9058f8c3&brand=Apple&build=73000100&c_locale=zh-Hant_TW&categoryAbTest=0&cityCode=310114&device=phone&disable_rcmd=0&extendInfo=%7B%22appOpenTime%22%3A1687251817821%2C%22duration%22%3A791070%7D&feedType=0&mVersion=191&mallVersion=7300000&mobi_app=iphone&network=wifi&openEvent=cold&pageNum=1&platform=ios&s_locale=zh-Hant_CN',
    url: 'https://mall.bilibili.com/mall-c-search/home/index/v2?disable_rcmd=0&feedType=0&pageNum=1&mVersion=191',
  })
  ctx.body = res.data
})

// ## app 首页瀑布流商品列表
router.get('/mall/index/products', async ctx => {
  const { cookie } = ctx.headers
  const { pn } = ctx.query

  const res = await axios({
    method: 'get',
    // url: `https://mall.bilibili.com/mall-c-search/home/feed/list?disable_rcmd=0&feedType=0&mVersion=7&pageNum=${pn}&platform=ios`
    url: `https://mall.bilibili.com/mall-c-search/home/feed/list?mobi_app=iphone&openEvent=cold&build=0&pageNum=${pn}&mVersion=7&platform=h5&feedType=0`,
    headers: {
      cookie
    },
  })
  ctx.body = res.data
})

// ## 所有分类
router.get('/mall/categories', async ctx => {
  const res = await axios({
    method: 'get',
    url: 'https://mall.bilibili.com/mall-c-search/home/category/listV2',
  })
  ctx.body = res.data
})

// ## 单个 filter 类型的全部分类
router.get('/mall/category/allfilter', async ctx => {
  const { filterType, termQueries, keyword, scene } = ctx.query
  console.log(filterType, termQueries)

  const res = await axios({
    method: 'post',
    url: 'https://mall.bilibili.com/mall/noah/search/category/allfilter',
    data: {
      filterType: parseInt(filterType),
      keyword,
      scene,
      termQueries: JSON.parse(termQueries)
    }
  })
  ctx.body = res.data
})

// ## 筛选后的商品数量
router.post('/mall/category/filtered/count', async ctx => {
  console.log(ctx.request.body)

  const res = await axios({
    method: 'post',
    url: 'https://mall.bilibili.com/mall/noah/search/category/items/count',
    data: ctx.request.body
  })
  ctx.body = res.data
})

// todo
// ## 商品列表
router.post('/mall/products', async ctx => {
  const { ps = 32, pn = 1, sortType = 'totalrank' } = ctx.query
  const filter = ctx.request.body
  const defaultData = {
    keyword: "",
    filters: "",
    priceFlow: "",
    priceCeil: "",
    sortType,  // 排序，totalrank | sale | price, 综合｜销量｜价格
    sortOrder: "",  // 配合 sortType: 'price' 使用，desc | asc, 价格降序｜价格升序
    pageIndex: 1,   // 页数
    userId: "",
    state: "",
    scene: "",
    termQueries: [  // required，获取商品数据必须的查询参数
      // {
      //   field: '0', // searchFilter.key
      //   values: ['0'],  // value: {String} | values: {[String]}, id
      // },

      // {
      //   field: "3",
      //   values: ["1_107"]
      // },
      // {
      //   field: "sale_type",
      //   values: ["0", "2", "6", "7"]
      // },
      // ??
      // {
      //   field: "5",
      //   values: ["0"]
      // },
      // ??
      // {
      //   field: "sold_status",
      //   values: ["1"]
      // }
    ],
    rangeQueries: [],
    pageSize: 32, // page size, default: 32
    // from: "pc_show",
    msource: ""
  }
  console.log(filter)

  const res = await axios({
    method: 'post',
    url: 'https://mall.bilibili.com/mall/noah/search/category/v2',
    data: filter,
    // data: Object.assign(defaultData, {
    //   pageSize: ps,
    //   pageIndex: pn,
    //   sortType,
    // }),
  })
  ctx.body = res.data
})

// ## 搜索建议
router.get('/mall/search', async ctx => {
  const { keyword } = ctx.query

  const res = await axios({
    method: 'get',
    url: 'https://mall.bilibili.com/mall-c-search/home/sug',
    params: {
      type: 1,
      term: keyword
    }
  })
  ctx.body = res.data
})

// ## 商品详情
router.get('/mall/product', async ctx => {
  const { id } = ctx.query

  const res = await axios({
    method: 'get',
    url: 'https://mall.bilibili.com/mall-c-search/items/info',
    params: {
      itemsId: id,
      // shopId: 2233, // ?
      // itemsVersion: '', // ?
      // v: 1691400173256, // ?
    }
  })
  ctx.body = res.data
})

// ## 预估到手价
router.get('/mall/product/price', async ctx => {
  const { itemsId, skuId, num } = ctx.query

  const res = await axios({
    method: 'post',
    url: 'https://mall.bilibili.com/mall-c-search/items/net/price',
    data: {
      itemsId: "10037058",
      selectedSkuList: [
        {
          selectedSkuNum: 1,
          skuId: 1000085606
        }
      ]
    }
  })
  ctx.body = res.data
})

module.exports = router


const term_query = [
  // Q 版手办
  {
    field: 'category',
    values: ['2_121'],
  },
  // 手办雕像
  {
    field: 'category',
    values: ['1_107'],
  },
  {
    field: '6',
    values: ['0', '2', '3', '5', '6', '7'],
  },
  // 画集
  {
    field: 'category',
    values: ['2_736'],
  },
  {
    field: '6',
    values: ['0', '2', '3', '5', '6', '7'],
  },
  // 景品
  {
    field: 'category',
    values: ['2_175'],
  },
  // 谷子
  {
    field: 'category',
    values: ['2_889'],
  },
  // 漫画
  {
    field: 'category',
    values: ['2_737'],
  },
  // 毛绒玩具
  {
    field: 'category',
    values: ['2_848'],
  },
  // 轻小说
  {
    field: 'category',
    values: ['2_860'],
  },
]
