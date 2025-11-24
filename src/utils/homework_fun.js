export const dealRichText = function (str) {
  if (!str || Object.prototype.toString.call(str) === '[object Array]') return str
  let resultArr = []
  if (/span/g.test(str)) {
    let arr = str.split('</span>')
    arr.forEach((item, index) => {
      if (item.includes('<span')) {
        let obj = {}
            let className = /(?<=class=')[^>]*(?=')/.exec(item)
            obj[className] = arr[index].replace(/<span[^<]*>([^<>]*)/, '$1')
            arr[index] = obj
      }
    })
    arr.forEach(item => {
      if (item.toString() === '[object Object]') {
        Object.keys(item).forEach(className => {
          for (const font of item[className]) {
            font = `<span class='${className}'>${font}</span>`
            resultArr.push(font)
          }
        })
      } else {
        resultArr.push(item)
      }
    })
  } else {
    resultArr = str.split('')
  }
  return resultArr
}

export const splitChineseWord = function(word) {
  // 剔除标签后老师输入的内容
  if (/<|>/g.test(word)) {
    let execArr = word.match(/(?<=>)[^<>]+(?=<)/g)
    if (execArr !== null) {
      return execArr.join('')
    } else {
      return ''
    }
  } else {
    return word
  }
}