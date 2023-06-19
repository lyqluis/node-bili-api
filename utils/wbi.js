/**
 * Wbi 签名算法
 * 参考：https://socialsisteryi.github.io/bilibili-API-collect/docs/misc/sign/wbi.html#wbi%E7%AD%BE%E5%90%8D%E7%AE%97%E6%B3%95
 * bilibili has changed the wbi's img_key & sub_key to the fixed ones,
 * while the link below has not been up to date
 */

const md5 = require('md5')

const key1 = {
  wbiImgKey: "9cbd34c7c24843b98a3a2f55478ec886",
  wbiSubKey: "2d58c3d513d34355aad4b4315a9944e5",
  // web_location: 1280305,  // ??
}

const key2 = {
  wbiImgKey: "dd9dcda7f11b4123be30aa009d14802e",
  wbiSubKey: "f354297e6975410195010eb260174ed4",
  // web_location: 1280306,  // ??
}

const mixinKeyEncTab = [
  46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49,
  33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40,
  61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11,
  36, 20, 34, 44, 52
]

// 获取最新的 img_key 和 sub_key
function getWbiKeys(wbi_img) {
  // const resp = await axios({
  //   url: 'https://api.bilibili.com/x/web-interface/nav',
  //   method: 'get',
  //   responseType: 'json'
  // }),
  //   json_content = resp.data,
  // img_url = json_content.data.wbi_img.img_url,
  // sub_url = json_content.data.wbi_img.sub_url
  // console.log(wbi_img)
  const { img_url, sub_url } = wbi_img
  // console.log(img_url.substring(img_url.lastIndexOf('/') + 1, img_url.length).split('.')[0])

  return {
    img_key: img_url.substring(img_url.lastIndexOf('/') + 1, img_url.length).split('.')[0],
    sub_key: sub_url.substring(sub_url.lastIndexOf('/') + 1, sub_url.length).split('.')[0]
  }
}

// 对 imgKey 和 subKey 进行字符顺序打乱编码
function getMixinKey(orig) {
  let temp = ''
  mixinKeyEncTab.forEach((n) => {
    temp += orig[n] ?? ''
  })
  return temp.slice(0, 32)
}

const defaultParams = {
  web_location: 1280305,
}

// 为请求参数进行 wbi 签名
function encWbi(params, img_key, sub_key) {
  const mixin_key = getMixinKey(key1.wbiImgKey + key1.wbiSubKey)
  const curr_time = Math.round(Date.now() / 1000)
  const chr_filter = /[!'()*]/g

  params = Object.assign(params, defaultParams)    // 添加 web_location 字段
  params = params.wts ? params : Object.assign(params, { wts: curr_time })    // 添加 wts 字段

  // 按照 key 重排参数
  let query = []
  Object.keys(params).sort().forEach((key) => {
    query.push(
      encodeURIComponent(key) +
      '=' +
      // 过滤 value 中的 "!'()*" 字符
      encodeURIComponent(('' + params[key]).replace(chr_filter, ''))
    )
  })
  const queryStr = query.join('&')
  const wbi_sign = md5(queryStr + mixin_key) // 计算 w_rid

  console.log(query, wbi_sign)

  return queryStr + '&w_rid=' + wbi_sign

}

module.exports = {
  encWbi
}

// const wbi_keys = await getWbiKeys()

// const query = encWbi(
//   {
//     foo: '114',
//     bar: '514',
//     baz: 1919810
//   },
//   wbi_keys.img_key,
//   wbi_keys.sub_key
// )
// console.log(query)