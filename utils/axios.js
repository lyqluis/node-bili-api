const axios = require('axios')
const http = require('http')
const https = require('https')

// let settings = {
//   method: method,
//   url: url,
//   headers: headers,
//   data: new URLSearchParams(data).toString(),
//   httpAgent: new http.Agent({ keepAlive: true }),
//   httpsAgent: new https.Agent({ keepAlive: true }),
// }


function fetch(url, data, options) {
  return new Promise((resolve, reject) => {
    axios({
      url,
      data,

    })
  })
}

const tstAxios = options => {
  axios(options)
    .then(res => {
      console.log('🍺', res.data)
      return res.data
    }).catch(err => {
      console.log('❌', err)
    })
}

module.exports = {
  fetch,
  tstAxios,
}