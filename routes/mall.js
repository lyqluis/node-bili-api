const axios = require("axios")
const router = require("koa-router")()

// ## app 会员购首页信息
router.get("/mall/index", async (ctx) => {
	const res = await axios({
		method: "get",
		// url: 'https://mall.bilibili.com/mall-c-search/home/index/v2?appkey=27eb53fc9058f8c3&brand=Apple&build=73000100&c_locale=zh-Hant_TW&categoryAbTest=0&cityCode=310114&device=phone&disable_rcmd=0&extendInfo=%7B%22appOpenTime%22%3A1687251817821%2C%22duration%22%3A791070%7D&feedType=0&mVersion=191&mallVersion=7300000&mobi_app=iphone&network=wifi&openEvent=cold&pageNum=1&platform=ios&s_locale=zh-Hant_CN',
		url: "https://mall.bilibili.com/mall-c-search/home/index/v2?disable_rcmd=0&feedType=0&pageNum=1&mVersion=191",
	})
	ctx.body = res.data
})

// ## app 首页瀑布流商品列表
router.get("/mall/index/products", async (ctx) => {
	const { cookie } = ctx.headers
	const { pn } = ctx.query

	const res = await axios({
		method: "get",
		// url: `https://mall.bilibili.com/mall-c-search/home/feed/list?disable_rcmd=0&feedType=0&mVersion=7&pageNum=${pn}&platform=ios`
		url: `https://mall.bilibili.com/mall-c-search/home/feed/list?mobi_app=iphone&openEvent=cold&build=0&pageNum=${pn}&mVersion=7&platform=h5&feedType=0`,
		headers: {
			cookie,
		},
	})
	ctx.body = res.data
})

// ## 所有分类
router.get("/mall/categories", async (ctx) => {
	const res = await axios({
		method: "get",
		url: "https://mall.bilibili.com/mall-c-search/home/category/listV2",
	})
	ctx.body = res.data
})

// ## 单个 filter 类型的全部分类
router.get("/mall/category/allfilter", async (ctx) => {
	const { filterType, termQueries, keyword, scene } = ctx.query
	console.log(filterType, termQueries)

	const res = await axios({
		method: "post",
		url: "https://mall.bilibili.com/mall/noah/search/category/allfilter",
		data: {
			filterType: parseInt(filterType),
			keyword,
			scene,
			termQueries: JSON.parse(termQueries),
		},
	})
	ctx.body = res.data
})

// ## 筛选后的商品数量
router.post("/mall/category/filtered/count", async (ctx) => {
	console.log(ctx.request.body)

	const res = await axios({
		method: "post",
		url: "https://mall.bilibili.com/mall/noah/search/category/items/count",
		data: ctx.request.body,
	})
	ctx.body = res.data
})

// todo
// ## 商品列表
router.post("/mall/products", async (ctx) => {
	const { ps = 32, pn = 1, sortType = "totalrank" } = ctx.query
	const filter = ctx.request.body
	const defaultData = {
		keyword: "",
		filters: "",
		priceFlow: "",
		priceCeil: "",
		sortType, // 排序，totalrank | sale | price, 综合｜销量｜价格
		sortOrder: "", // 配合 sortType: 'price' 使用，desc | asc, 价格降序｜价格升序
		pageIndex: 1, // 页数
		userId: "",
		state: "",
		scene: "",
		termQueries: [
			// required，获取商品数据必须的查询参数
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
		msource: "",
	}
	console.log(filter)

	const res = await axios({
		method: "post",
		url: "https://mall.bilibili.com/mall/noah/search/category/v2",
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
router.get("/mall/search", async (ctx) => {
	const { keyword } = ctx.query

	const res = await axios({
		method: "get",
		url: "https://mall.bilibili.com/mall-c-search/home/sug",
		params: {
			type: 1,
			term: keyword,
		},
	})
	ctx.body = res.data
})

// ## 商品详情
router.get("/mall/product", async (ctx) => {
	const { id } = ctx.query

	const res = await axios({
		method: "get",
		url: "https://mall.bilibili.com/mall-c-search/items/info",
		params: {
			itemsId: id,
			// shopId: 2233, // ?
			// itemsVersion: '', // ?
			// v: 1691400173256, // ?
		},
	})
	ctx.body = res.data
})

// ## 预估到手价 doesn't work now
router.get("/mall/product/price", async (ctx) => {
	const { itemsId, skuId, num } = ctx.query
	const { cookie } = ctx.headers

	const res = await axios({
		method: "post",
		url: "https://mall.bilibili.com/mall-c-search/items/net/price",
		data: {
			// itemsId: "10037058",
			itemsId: itemsId.toString(),
			selectedSkuList: [
				{
					selectedSkuNum: num,
					skuId,
				},
			],
		},
		headers: {
      // todo find out the key cookie value
			cookie:
				"_uuid=3707E267-2083-983A-EF2A-79E4E64D81DE35000infoc; nostalgia_conf=-1; buvid_fp=1bfe0883070fb2a1fe9c67a808ec08d1; buvid4=BFA9FF88-2AA1-2631-296A-F8580DBF621379844-022012414-GxGUu0ajyPomoN0KMwnnbw%3D%3D; buvid3=65F796AC-840E-BFBA-75B9-789D019ED0BC91379infoc; b_nut=1688120091; FEED_LIVE_VERSION=V8; header_theme_version=CLOSE; home_feed_column=5; DedeUserID=1412469; DedeUserID__ckMd5=745912769d882942; CURRENT_FNVAL=4048; rpdid=|(J|J|l~kR)R0J'uY)))mkRJl; fingerprint=1bfe0883070fb2a1fe9c67a808ec08d1; bsource=search_baidu; browser_resolution=1440-758; deviceFingerprint=a4cd7add2d20c7303b463530b53dcdbb; SESSDATA=77897508%2C1706686299%2C09881%2A82pEUL0BcoxiiPgEYj8M_2BueSM_2xT2vrpBx6pDTOK2MbtpENEzM3JHqe3_AGvTh_uJwDhwAARQA; bili_jct=c6d9db3d07051f41d48ba961c6c0fabc; sid=me8j9o2n; bp_video_offset_1412469=825899808498647048; innersign=0; from=malldetail; kfcFrom=category_sb; b_lsid=9106E6A8D_189D3C28D14",
		},
	})
	ctx.body = res.data
})

module.exports = router

const term_query = [
	// Q 版手办
	{
		field: "category",
		values: ["2_121"],
	},
	// 手办雕像
	{
		field: "category",
		values: ["1_107"],
	},
	{
		field: "6",
		values: ["0", "2", "3", "5", "6", "7"],
	},
	// 画集
	{
		field: "category",
		values: ["2_736"],
	},
	{
		field: "6",
		values: ["0", "2", "3", "5", "6", "7"],
	},
	// 景品
	{
		field: "category",
		values: ["2_175"],
	},
	// 谷子
	{
		field: "category",
		values: ["2_889"],
	},
	// 漫画
	{
		field: "category",
		values: ["2_737"],
	},
	// 毛绒玩具
	{
		field: "category",
		values: ["2_848"],
	},
	// 轻小说
	{
		field: "category",
		values: ["2_860"],
	},
]
