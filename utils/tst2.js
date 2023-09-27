const BUFFER_TIME = 10
let mediaBuffered = 0

const addSource = (mediaInfo, mediaSource, el, mediaUrl) => {
	const mediaSourceBuffer = mediaSource.addSourceBuffer(mediaInfo.mimeCodec)

	let isLastSegement
	let currentRange

	async function getNextMedia(url, range, step = 100000) {
		if (!range) {
			range = `${currentRange}-${currentRange + step}`
		}
		console.log("params: range", range)

		const res = await axios({
			url,
			method: "post",
			headers: {
				range: `bytes=${range}`,
				// pragma: "no-cache",
			},
			data: {
				baseUrl: mediaInfo.baseUrl,
			},
			responseType: "arraybuffer", // 数据请求类型一定要是 arraybuffer
		})
		console.log("fetch buffer", range, typeof res, res)

		// caculate current range
		const [, start, end] = range.match(/(\d*)-(\d*)/)
		const dis = end - start + 1
		currentRange = parseInt(end) + 1

		// last segmenet
		// when res.headers.contentLength < current range
		// means that this is the last segment of the video
		if (res.headers["content-length"] < dis) {
			isLastSegement = true
		}
		// 往容器中添加请求到的数据，不会影响当下的视频播放。
		mediaSourceBuffer.appendBuffer(res.data)
	}

	mediaSourceBuffer.addEventListener("updateend", async () => {
		console.log("video buffer update end")

		// 全部视频片段加载完关闭容器
		if (isLastSegement) {
			mediaSource.endOfStream()
			URL.revokeObjectURL(el.src) // Blob URL 已经使用并加载，不需要再次使用的话可以释放掉
			return
		}

		// if (!isControl || !mediaSourceBuffer.buffered.length) {
		if (!mediaSourceBuffer.buffered.length) {
			await getNextMedia(mediaUrl)
			return
		}

		console.log(mediaSourceBuffer.buffered.end(0))

		const bufferEnd = (mediaBuffered = mediaSourceBuffer.buffered.end(0))
		const { currentTime } = el
		if (!isLastSegement && bufferEnd - currentTime < BUFFER_TIME) {
			await getNextMedia(mediaUrl)
			return
		}

		// console.log("can play")
		el.paused && el.play()
	})

	el.addEventListener("timeupdate", async () => {
		const { currentTime } = el

		// video buffer
		const buffered = el.buffered

		if (buffered.length > 0) {
			console.log("video play current time:", currentTime, buffered.end(0))
			const end = buffered.end(0)

			if (!isLastSegement && mediaBuffered - currentTime < BUFFER_TIME) {
				if (el.paused) return
				el.pause()
				await getNextMedia(mediaUrl)
			}
		}
	})

	// range length, 1000000 => 18s
	//加载初始视频
	getNextMedia(mediaUrl, mediaInfo.segment_base.initialization)
}
