const router = require('koa-router')()
const path = require("path")
const { loadFilesFromDir } = require('../utils/file')

router.get('/', async (ctx, next) => {
  ctx.body = 'success'
  next()
})

/**
 * @param {Array} files files array
 */
function useAll(files) {
  files.forEach((route) => {
    router.use("", route.file.routes(), route.file.allowedMethods())
  })
}

const files = loadFilesFromDir(path.join(__dirname, "./"), false)
useAll(files)

module.exports = router

