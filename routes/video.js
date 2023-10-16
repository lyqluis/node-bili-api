const axios = require("axios")
const cheerio = require("cheerio")
const router = require("koa-router")()

// todo video page detail info
router.get("/video/detail", async (ctx) => {
	const { cookie } = ctx.headers
	const { id } = ctx.query

	const res = await axios({
		method: "get",
		url: "https://api.bilibili.com/x/web-interface/wbi/view/detail",
		params: {
			bvid: id,
			// need_view: 1,
			// web_location: 1315873,
			// w_rid: "371cabc23528663af0ddc0627f1dcc1a",
			// wts: 1693554351,
		},
		headers: {
			cookie,
		},
	})

	ctx.body = res.data
})

// todo current online audience
router.get("/video/online", async (ctx) => {
	const { cookie } = ctx.headers
	const { bvid, cid } = ctx.query

	const res = await axios({
		method: "get",
		url: " https://api.bilibili.com/x/player/online/total",
		params: {
			bvid,
			cid, // required
			// aid: 616897759,
			// ts: 56451816,
		},
		// headers: {
		// 	cookie,
		// },
	})

	ctx.body = res.data
})

// get video's info
// TODO change to get play url through url directly
// https://api.bilibili.com/x/player/wbi/playurl?avid=747199530&cid=1298925721&qn=16&type=mp4&platform=html5&web_location=1315877&w_rid=d7055e37f9f4ab62938be3264d84a983&wts=1697444365
router.get("/video/:id", async (ctx) => {
	const { id } = ctx.params

	// get playInfo from page script
	const res = await axios(`https://www.bilibili.com/video/${id}/`)
	const reg = /window.__playinfo__=/
	let target
	const html = res.data
	const $ = cheerio.load(html)
	$("script").each((i, el) => {
		const scriptContent = $(el).html()
		if (reg.test(scriptContent)) target = scriptContent
	})
	const match = target.match(/window.__playinfo__=(.*?)(?=;|$)/)
	const playInfo = JSON.parse(match[1])
	const dash = playInfo.data.dash
	console.log(playInfo.data.dash)
	// select any one of the array
	const minBandwidthReducer = (a, b) => (a.bandwidth < b.bandwidth ? a : b)
	const videoInfo = dash.video.reduce(minBandwidthReducer)
	const audioInfo = dash.audio.reduce(minBandwidthReducer)

	ctx.body = { videoInfo, audioInfo, playInfo }
})

// get video play data
router.post("/video/:id", async (ctx) => {
	// const { id } = ctx.params
	const { baseUrl } = ctx.request.body
	const { range } = ctx.headers

	// if range, return video's url
	console.log(baseUrl, range)
	// ctx.body = videoInfo
	// const videoUrl = video.baseUrl
	const res = await axios({
		url: baseUrl,
		method: "get",
		headers:
			// ctx.headers,
			{
				range,
			},
		responseType: "arraybuffer",
	})

	ctx.status = res.status
	console.log("type of res.headers", typeof res.headers)
	const header = Object.assign({}, res.headers)
	delete header["access-control-allow-origin"]
	ctx.set(header)
	console.log("set headers", header)
	// ctx.set("Access-Control-Allow-Origin", null)
	ctx.body = res.data

	// const
})

module.exports = router
