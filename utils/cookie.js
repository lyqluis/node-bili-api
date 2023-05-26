const cookie = require('cookie')
const axios = require('axios')

const cookieOptionKeys = [
  'maxAge',
  'expires',
  'path',
  'domain',
  'secure',
  'httpOnly',
  'priority',
  'sameSite',
  'signed',
  'overwrite',
]

/**
 * @func: sperate name & value from cookie object
 * @param {Object} cookieObject
 * @return {Object} cookie object {name, value, options:{}}
 */
const parseCookie = cookieObject => {
  const res = { options: {} }
  for (const key in cookieObject) {
    const val = cookieObject[key]
    const lowerCaseKey = key.toLowerCase()
    if (lowerCaseKey === 'domain') continue
    if (lowerCaseKey === 'expires') {
      res.options = { ...res.options, [lowerCaseKey]: new Date(Date.parse(val)) }
    } else if (cookieOptionKeys.includes(lowerCaseKey)) {
      res.options = { ...res.options, [lowerCaseKey]: val }
    } else {
      res.name = key
      res.value = val
    }
  }
  return res
}

/**
 * @func: parse cookie to cookie object array
 * @param {[Srting]|String} cookies
 * @return {[Object]} cookie object array
 */
const parseCookies = cookies => {
  if (!cookies) return
  if (Array.isArray(cookies)) {
    cookies = cookies.map(c => parseCookie(cookie.parse(c)))
  } else {
    cookies = [parseCookie(cookie.parse(cookies))]
  }
  return cookies
}

const getCookies = async () => {
  const res = await axios('https://bilibili.com')
  const cookies = res.headers['set-cookie']
  console.log('🔒 get cookies from bilibili', cookies)
  return parseCookies(cookies)
}

const cookieMiddleware = async (ctx, next) => {
  // request doesn't have cookies
  if (!ctx.headers?.cookie) {
    const cookies = await getCookies()
    ctx.state.cookies = cookies
    cookies?.length && cookies.map(({ name, value, options }) => ctx.cookies.set(name, value, options))
  } else {
    ctx.state.cookies = ctx.headers?.cookie
  }
  await next()
}

module.exports = {
  parseCookies,
  getCookies,
  cookieMiddleware,
}