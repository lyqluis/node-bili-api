const fs = require('fs')
const path = require('path')

/**
 * @func: 
 * @param {String} path
 * @return {Object} path info obejct
 * - dir <string>
 * - root <string>
 * - base <string>
 * - name <string>
 * - ext <string>
 */
const getPathInfo = p => path.parse(p)

/**
 * @description 递归读取文件，类似于 webpack 的 require.context()
 * @param {String} directory 文件目录
 * @param {Boolean} useSubdir 是否查询子目录，默认 false
 * @param {Array} extList 查询文件后缀，默认 ['.js']
 * @param {Array} excludes 排除文件，默认 ['index']
 * @return {[Object]} files array
*/
const loadFilesFromDir = (
  directory,
  useSubdir = false,
  extList = [".js"],
  excludes = ['index']
) => {
  const filesList = []
  // 递归读取文件
  function readFileList(directory, useSubdir, extList, excludes) {
    const files = fs.readdirSync(directory) // 同步读取目录
    files.forEach((item) => {
      const fullPath = path.join(directory, item)
      const stat = fs.statSync(fullPath)  // 文件信息对象
      // 递归子目录
      if (stat.isDirectory() && useSubdir) {
        readFileList(path.join(directory, item), useSubdir, extList, excludes)
      } else {
        const info = getPathInfo(fullPath)
        !excludes.includes(info.name) && extList.includes(info.ext) && filesList.push({
          path: fullPath,
          file: require(fullPath),
          ...info,
        })
      }
    })
  }
  readFileList(directory, useSubdir, extList, excludes)
  
  return filesList
}

module.exports = {
  getPathInfo,
  loadFilesFromDir
}