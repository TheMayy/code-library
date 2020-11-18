const path = require('path')
const fs = require('fs')

const basePath = 'D:/work/ruite/src/views/print/report'

function mapDir(dir, callback, finish) {
  fs.readdir(dir, function(err, files) {
    if (err) {
      console.error(err)
      return
    }
    files.forEach((filename, index) => {
      let pathname = path.join(dir, filename)
      fs.stat(pathname, (err, stats) => { // 读取文件信息
        if (err) {
          console.log('获取文件stats失败')
          return
        }
        if (stats.isDirectory()) {
          mapDir(pathname, callback, finish)
        } else if (stats.isFile()) {
          if (['.json', '.less'].includes(path.extname(pathname))) {  // 排除 目录下的 json less 文件
            return
          }
          callback && callback(filename)

          // 读取文件内容
          // fs.readFile(pathname, (err, data) => {
          //   if (err) {
          //     console.error(err)
          //     return
          //   }
          //   callback && callback(data)
          // })
        }
      })
      if (index === files.length - 1) {
        finish && finish()
      }
    })
  })
}

mapDir(
  basePath,
  function(file) {
    console.log(file.split('.')[0])
    // 读取文件后的处理
  },
  function() {
    // console.log('xxx文件目录遍历完了')
  }
)