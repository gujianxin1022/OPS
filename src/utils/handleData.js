import {getStorage} from "./handleStorage";
import axios from 'axios';

import { isObject, isNull } from "lodash-es";

export function deepFreeze(o) {
  Object.freeze(o);

  Object.getOwnPropertyNames(o).forEach(function (prop) {
    if (
      o.hasOwnProperty(prop) &&
      !isNull(o[prop]) &&
      isObject(o[prop]) &&
      !Object.isFrozen(o[prop])
    ) {
      deepFreeze(o[prop]);
    }
  });

  return o;
}

/**
 * 根据id获取当前数据
 * @param {Number, String} id id值
 * @param {String} idName id名字，比如id，brandId
 * @param {Array} arrData 数据数组
 */
export function getInfoById(id, idName, arrData) {
  for (let j = 0, len = arrData.length; j < len; j++) {
    if (Number(id) === Number(arrData[j][idName])) {
      return arrData[j]
    }
  }
}

/**
 * 过滤传参中无效的key-value
 * @param {Object} obj 参数集合
 */
export function sortParams(obj) {
  const newObj = obj
  for (const item in newObj) {
    if (newObj[item] === null || newObj[item] === '' || newObj[item] === [] || newObj[item] === undefined) {
      delete newObj[item]
    }
  }
  return newObj
}

/**
 * 取字节长度
 * @param {String} str 需要获取字节长度的字符串
 */
export function getByteLength(str) {
  if (str === '') return 0
  let len = 0
  for (let i = 0, length = str.length; i < length; i++) {
    var c = str.charCodeAt(i) > 255 ? 2 : 1
    len += c
  }
  return len
}

/**
 * 过滤menuMap
 * @param {String} menuMap
 */
export function formatMenuMap(menuMap) {
  const newMenuMap = []
  for (let i = 0, length = menuMap.length; i < length; i++) {
    if (menuMap[i].children && menuMap[i].children.length > 0) {
      newMenuMap.push(menuMap[i])
    }
  }
  return newMenuMap
}

/**
 * 生成menuIndex
 * @param {Object} menuMap
 */
export function getMenuIndex(menuMap) {
  const newMenuMap = formatMenuMap(menuMap)
  let menuIndex={}
  for (let i = 0, length = newMenuMap.length; i < length; i++) {
    const secondMenuMap = newMenuMap[i].children
    if (!secondMenuMap) continue
    for (let l = 0, length = secondMenuMap.length; l < length; l++) {
      const thirdMenuMap = secondMenuMap[l].children
      if (!thirdMenuMap) continue
      for (let m = 0, length = thirdMenuMap.length; m < length; m++) {
        const key = thirdMenuMap[m]['url']
        const value = [i, thirdMenuMap[m], key]
        menuIndex[key] = value
      }
    }
  }
  return menuIndex
}

/**
 * 获取设备名称
 */
export function getDevice(userAgent) {
  if (/android/i.test(userAgent)) {
    return 'android'
  } else if (/ios/i.test(userAgent)) {
    return 'ios'
  } else if (/mac/i.test(userAgent)) {
    return 'mac'
  } else if (/windows/i.test(userAgent)) {
    return 'windows'
  } else if (/ipad/i.test(userAgent)) {
    return 'ipad';
  }
}

/**
 * 千分位转换
 * @param {Int} num 需要转换的数值
 */
export function thousandthPercentile(num) {
  if (isNaN(num)) {
    throw new TypeError("num is not a number");
  }
  var groups = (/([\-\+]?)(\d*)(\.\d+)?/g).exec("" + num),
    mask = groups[1],            //符号位
    integers = (groups[2] || "").split(""), //整数部分
    decimal = groups[3] || "",       //小数部分
    remain = integers.length % 3;

  var temp = integers.reduce(function (previousValue, currentValue, index) {
    if (index + 1 === remain || (index + 1 - remain) % 3 === 0) {
      return previousValue + currentValue + ",";
    } else {
      return previousValue + currentValue;
    }
  }, "").replace(/\,$/g, "");
  return mask + temp + decimal;
}

/**
 * 标签、类名替换
 * 去掉style
 * 末尾多个br保留一个
 */
export function replacePStyleLastBr(originData, isReadItem) {
  if (isReadItem) {
    return translateMark(replacePtagReadItem(originData).replace(/style="max-width:100%;"/, '').replace(/(<br>){2,}$/g, '<br>'))
  } else {
    return translateMark(replacePtagNotReadItem(originData).replace(/style="max-width:100%;"/, '').replace(/(<br>){2,}$/g, '<br>'))
  }
}

/**
 * 替换非阅读题p div br标签，去掉
 */
export function replacePtagNotReadItem(originData) {
  return originData.replace(/((<p\>)|(<\/p\>))/g, '').replace(/((<div\>)|(<\/div\>))/g, '').replace(/<br>/g, '')
}

/**
 * 替换阅读题空段落标签
 */
export function replacePtagReadItem(originData) {
  return originData.replace(/(<p><br><\/p>)+$/g, '')
}

/**
 * 双引号变单引号
 */
export function translateMark(originData) {
  return originData.replace(/\"/g, "'")
}

/**
 * font -> span
 * face -> class
 */
export function replaceFontFace(originData) {
  if (!originData) return originData
  return originData.replace(/font/g, 'span').replace(/face/g, 'class')
}

/**
 * span -> font
 * class -> face
 */
export function replaceSpanClass(originData) {
  if (!originData) return originData
  return originData.replace(/span/g, 'font').replace(/class/g, 'face')
}

// 深克隆
export function deepClone(obj) {
  // 先检测是不是数组和Object
  // let isArr = Object.prototype.toString.call(obj) === '[object Array]';
  let isArr = Array.isArray(obj);
  let isJson = Object.prototype.toString.call(obj) === '[object Object]';
  if (isArr) {
    // 克隆数组
    let newObj = [];
    for (let i = 0; i < obj.length; i++) {
      newObj[i] = deepClone(obj[i]);
    }
    return newObj;
  } else if (isJson) {
    // 克隆Object
    let newObj = {};
    for (let i in obj) {
      newObj[i] = deepClone(obj[i]);
    }
    return newObj;
  }
  // 不是引用类型直接返回
  return obj;
};

/**
 * 下载文件
 * @param url 路径
 * @param fileName 文件名
 */
export function downloadFile(url, fileName) {
  let token = JSON.parse(getStorage('userInfo'))
  axios({
    url,
    method: 'get',
    responseType: 'arraybuffer',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Authorization': `Bearer ${token.jwtToken}`
    },
  })
    .then(function (response) {
      let blob = new Blob([response.data])
      let downloadElement = document.createElement('a');
      let href = window.URL.createObjectURL(blob); //创建下载的链接
      downloadElement.href = href;
      downloadElement.download = `${fileName}.xls`; //下载后文件名
      document.body.appendChild(downloadElement);
      downloadElement.click(); //点击下载
      document.body.removeChild(downloadElement); //下载完成移除元素
      window.URL.revokeObjectURL(href); //释放掉blob对象

    })
    .catch(function (error) {
      console.log(error);
    });
}

/**
 * 防抖
 * @param func 回调函数
 * @param wait 间隔时间
 * @param immediate 是否在最开始的时候触发
 */
export function debounce(func, wait, immediate) {
  // 多个参数以及传递参数默认值的处理
  if (typeof func !== 'function') throw new TypeError('func must be an function')
  if (typeof wait === "undefined") wait = 500
  if (typeof wait === 'boolean') {
    immediate = wait
    wait = 500
  }
  if (typeof immediate !== 'boolean') immediate = false

  // 设置定时器返回值
  let timer = null
  return function proxy(...params) {
    let _this = this,
      now = immediate && !timer
    clearTimeout(timer)
    timer = setTimeout(function () {
      timer = null
      !immediate ? func.call(_this, ...params) : null
    }, wait)
    now ? func.call(_this, ...params) : null
  }
}

/**
 * 节流
 * @param callback 回调函数
 * @param wait 时长
 * @returns {function(...[*]=): void}
 */
export function throttle(callback, wait) {
  if (typeof callback !== 'function') throw new TypeError('callback must be a function')
  if (isNaN(wait)) throw new TypeError('The wait must be a number')

  let timer = null, proviouse = 0
  return function proxy(...params) {
    let _this = this,
      now = +new Date(),
      dValue = wait - (now - proviouse)

    if (dValue <= 0) {
      // 过了wait的时间 =是做临界点判断
      clearTimeout(timer)
      timer = null
      callback.call(_this, params)
    } else if (!timer) {
      timer = setTimeout(() => {
        clearTimeout(timer)
        timer = null
        callback.call(_this, params)
      }, wait);
    }
  }
}

/**
 *  @param second 秒 
 *  @returns --分钟--秒
 */
export function secondToMinute (s){
  let t = '';
      if(s > -1){
        let hour = Math.floor(s/3600)
        let min = Math.floor(s/60) % 60
        let sec = s % 60
        if(hour < 10) {
          t = '0'+ hour + ":"
        } else { 
          t = hour + ":"
        } 
        if(min < 10){
          t += "0"
        } 
        t += min + ":"
        if(sec < 10){
          t += "0"
        } 
        t += sec.toFixed(0)
      } 
      return t
}