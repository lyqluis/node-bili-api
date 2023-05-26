const axios = require('axios')
const router = require('koa-router')()

// ## search
// keyowrd, required, 搜索关键词
router.get('/search', async (ctx, next) => {
  const { keyword } = ctx.query
  const { cookie } = ctx.headers
  const res = await axios({
    method: 'get',
    url: `https://api.bilibili.com/x/web-interface/search/all/v2`,
    params: {
      keyword
    },
    headers: {
      cookie
    },
  })
  ctx.body = res.data
})

// ## search suggest
// term, {String}, required, 需要获得建议的输入内容
// main_ver, {String}, optional,	v1,	固定为 v1
// highlight,	{String},	optional, 任意，有此项开启关键词高亮标签
router.get('/searchsuggest', async (ctx, next) => {
  const { keyword } = ctx.query
  const { cookie } = ctx.headers
  const res = await axios({
    method: 'get',
    url: `https://s.search.bilibili.com/main/suggest`,
    params: {
      term: keyword,
    },
    headers: {
      cookie
    }
  })
  ctx.body = res.data
})

// ## hot search keyword
// 返回搜索前 10 的关键词
router.get('/hotsearchkeyword', async (ctx, next) => {
  const { cookie } = ctx.headers
  const res = await axios({
    method: 'get',
    url: `https://s.search.bilibili.com/main/hotword`,
    headers: {
      cookie
    }
  })
  ctx.body = res.data
})

// ## search placeholder
// 默认搜索为搜索框中默认填充内容，用于官方推荐内容，若不输入点击搜索按钮跳转为 url 中的链接
router.get('/searchplaceholder', async (ctx, next) => {
  const { cookie } = ctx.headers
  const res = await axios({
    method: 'get',
    url: `https://api.bilibili.com/x/web-interface/search/default`,
    headers: {
      cookie
    }
  })
  ctx.body = res.data
})

module.exports = router