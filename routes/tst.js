// todo change the file name to video

const axios = require("axios")
const cheerio = require("cheerio")
const router = require("koa-router")()

// get video's info
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

	// // get playInfo from page script
	// const match = target.match(/window.__playinfo__=(.*?)(?=;|$)/)
	// const playInfo = JSON.parse(match[1])
	// // console.log(playInfo)
	// console.log(playInfo.data.dash)
	// // select any one of the array
	// const videoInfo = playInfo.data.dash.video[0]

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

// todo video page detail info
// https://api.bilibili.com/x/web-interface/wbi/view/detail?aid=616897759&need_view=1&web_location=1315873&w_rid=371cabc23528663af0ddc0627f1dcc1a&wts=1693554351

// todo current online audience
// https://api.bilibili.com/x/player/online/total?aid=616897759&cid=1224002906&bvid=BV1ph4y1F7jG&ts=56451816

module.exports = router

// curl 'https://upos-sz-mirror08c.bilivideo.com/upgcxcode/02/95/1204699502/1204699502-1-100024.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1692189086&gen=playurlv2&os=08cbv&oi=3689537219&trid=54e607685b014f75b22f5cd085a07413u&mid=1412469&platform=pc&upsig=1ce3e94f9937fc903c333b453195e74e&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=0,3&buvid=65F796AC-840E-BFBA-75B9-789D019ED0BC91379infoc&build=0&f=u_0_0&agrr=1&bw=25145&logo=80000000' \
//   -H 'authority: upos-sz-mirror08c.bilivideo.com' \
//   -H 'accept: */*' \
//   -H 'accept-language: zh-CN,zh;q=0.9' \
//   -H 'cache-control: no-cache' \
//   -H 'origin: https://www.bilibili.com' \
//   -H 'pragma: no-cache' \
//   -H 'range: bytes=0-5882' \
//   -H 'referer: https://www.bilibili.com/video/BV1GN411e7yV/?vd_source=3c7de2df94ca4b883e6063b7c733aed4' \
//   -H 'sec-ch-ua: "Not/A)Brand";v="99", "Google Chrome";v="115", "Chromium";v="115"' \
//   -H 'sec-ch-ua-mobile: ?0' \
//   -H 'sec-ch-ua-platform: "macOS"' \
//   -H 'sec-fetch-dest: empty' \
//   -H 'sec-fetch-mode: cors' \
//   -H 'sec-fetch-site: cross-site' \
//   -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36' \
//   --compressed
