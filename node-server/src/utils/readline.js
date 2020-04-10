const fs = require('fs')
const path = require('path')
const readline = require('readline')

// 文件名
const fullFileName = path.join(__dirname, '../', '../', 'logs', 'access.log')
    // 创建read stream
const readStream = fs.createReadStream(fullFileName)
    // 创建readLine 对象
const rl = readline.createInterface({
    input: readStream
})

let chromeNum = 0
let sum = 0

// 逐行读取
rl.on('line', lineData => {
        if (!lineData) {
            return
        }
        // 记录总行数
        sum++

        const arr = lineData.split(' -- ')
        console.log(arr)
        if (arr[2] && arr[2].indexOf('Chrome' > 0)) {
            // 累加chrome的数量
            chromeNum++

        }
    })
    // 监听读取完成

rl.on('close', () => {
    console.log(chromeNum, sum)
    console.log('chrome 占比', chromeNum / sum)
})