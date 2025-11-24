/**
* 获取本周、本季度、本月、上月的开始日期、结束日期
*/
var now = new Date(); //当前日期
var nowDayOfWeek = now.getDay(); //今天本周的第几天
var nowDay = now.getDate(); //当前日
var nowMonth = now.getMonth(); //当前月
var nowYear = now.getYear(); //当前年
nowYear += (nowYear < 2000) ? 1900 : 0; //

var lastMonthDate = new Date(); //上月日期
lastMonthDate.setDate(1);
lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
var lastYear = lastMonthDate.getYear();
var lastMonth = lastMonthDate.getMonth();
//获得某月的天数
function getMonthDays(myMonth) {
  var monthStartDate = new Date(nowYear, myMonth, 1);
  var monthEndDate = new Date(nowYear, myMonth + 1, 1);
  var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
  return days;
}
export default {
  deleteMMSS(time) {
    return time.split(' ')[0]
  },
  /**
   * 转换 utc 时间格式为 2020-02-23 17:00:00 这种格式
   * @param {Date} utc 2019-11-26T07:38:17 utc时间格式
   */
  dateClockTime(utc) {
    if (utc == null) {
      return ''
    }
    let date = new Date(utc);
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    let H = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    let Mi = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    let S = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    let tempDate = Y + M + D + H + Mi + S;
    return tempDate
  },
  dateClockTimeMin(utc) {
    if (utc == null) {
      return ''
    }
    let date = new Date(utc);
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    let H = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    let Mi = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    let tempDate = Y + M + D + H + Mi;
    return tempDate
  },
  dateClockTimeMonth(utc) {
    if (utc == null) {
      return ''
    }
    let date = new Date(utc);
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    let tempDate = Y + M;
    return tempDate
  },
  handleOtherTimesError(utc) {
    let date = new Date(utc);
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    let H = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    let Mi = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    let S = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    let tempDate = Y + M + D;
    return tempDate
  },
  formartDate(date, fmt) {
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    let o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    }
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        let str = o[k] + ''
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : this.padLeftZero(str))
      }
    }
    return fmt
  },
  padLeftZero(str) {
    return ('00' + str).substr(str.length);
  },
  addDay(date, days) {
    date = new Date(date);
    let plusDays = date.getDate() * 1 + days * 1;
    date.setDate(plusDays);
    return date;
  },
  /**
   * @Author   Yaodongxin
   * @DateTime 2020-03-02
   * @method   getMonday 获取本周的周一日期对象
   */
  getMonday() {
    let date = new Date()
    let week = date.getDay()
    let day = date.getDate() * 1
    if (week == 0) {
      week = 7
    }
    date.setDate(day - week + 1)
    return date
  },
  /**
   * @Author   Yaodongxin
   * @DateTime 2020-03-02
   * @method   getSunday 获取本周的周日日期对象
   */
  getSunday() {
    let date = new Date(this.getMonday())
    let day = date.getDate() * 1
    date.setDate(day + 6)
    return date
  },
  /**
   * 当前日期的后 n 天
   * @param {Number}} AddDayCount 后几天数字
   */
  getDateStr(date, AddDayCount) {
    var dd = new Date(date);
    dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1);//获取当前月份的日期，不足10补0
    var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();//获取当前几号，不足10补0
    var h = dd.getHours()
    var min = dd.getMinutes()
    var s = dd.getSeconds()
    var d = `${y}/${m}/${d} ${h}:${min}:${s}`
    return new Date(d).toUTCString()
  },
  /**
   * 秒 =》 分钟
   * @param {Int} s 秒数
   */
  s_to_hs(s) {
    //计算分钟
    //算法：将秒数除以60，然后下舍入，既得到分钟数
    var h;
    h = Math.floor(s / 60);
    //计算秒
    //算法：取得秒%60的余数，既得到秒数
    s = s % 60;
    //将变量转换为字符串
    h += '';
    s += '';
    //如果只有一位数，前面增加一个0
    h = (h.length == 1) ? '0' + h : h;
    s = (s.length == 1) ? '0' + s : s;
    return h + '分' + s + '秒';
  },
  /**
    * @description: 在日期对象上加上周几
    * @param {Date} date 日期对象 
    * @return: yyyy-mm-dd (week) hh:mm:ss
    */
  timeHaveWeek(date) {
    let weekArr = [
      {
        text: '周一',
        num: 1,
      }, {
        text: '周二',
        num: 2,
      }, {
        text: '周三',
        num: 3,
      }, {
        text: '周四',
        num: 4,
      }, {
        text: '周五',
        num: 5,
      }, {
        text: '周六',
        num: 6,
      }, {
        text: '周日',
        num: 0,
      }]
    date = new Date(date)
    let year = date.getFullYear()
    let mouth = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)
    let day = (date.getDate()) < 10 ? "0" + (date.getDate()) : (date.getDate())
    let week = weekArr.find(item => item.num === date.getDay())
    let h = (date.getHours()) < 10 ? "0" + (date.getHours()) : (date.getHours())
    let m = (date.getMinutes()) < 10 ? "0" + (date.getMinutes()) : (date.getMinutes())
    let s = (date.getSeconds()) < 10 ? "0" + (date.getSeconds()) : (date.getSeconds())
    return `${year}.${mouth}.${day} （${week.text}）${h}:${m}:${s}`
  },
  /**
    * @description: 在日期上加八小时
    * @param {Date} time 日期对象
    * @return: 加8小时后的时间
    */
  addMinutes(time) {
    var date = new Date(time);     //1. js获取当前时间
    var min = date.getMinutes();  //2. 获取当前分钟
    date.setMinutes(min + 480);  //3. 设置当前时间+10分钟：把当前分钟数+10后的值重新设置为date对象的分钟数
    var y = date.getFullYear();
    var m = (date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1);
    var d = date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate();
    var h = date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours()
    var f = date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()
    var s = ''
    var formatdate = y + '-' + m + '-' + d + " " + h + ":" + f;
    return formatdate // 获取10分钟后的时间，格式为yyyy-mm-dd h:f:s
  },
  /**
    * 计算学生时区时间
    * @param {Date} time 时间对象
    * @param {String} f 运算符
    * @param {String} h 小时
    */
  handleTimes(time, f, h) {
    var date = new Date(time);
    var min = date.getMinutes();
    if (f == '-') {
      date.setMinutes(min - ((h + 8) * 60));
    } else if (f == '+') {
      date.setMinutes(min + ((h - 8) * 60));
    }
    return date.toISOString()
  },
  /**
    * 约课时 如果是学生时区的约课处理
    * @param {Date} time 需要进行处理的日期对象
    * @param {*} f 运算符
    * @param {*} h 学生用户时区距离UTC相差的时间
    */
  appointTimes(time, f, h) {
    var date = new Date(time)
    var min = date.getMinutes()
    if (f == '-') {
      date.setMinutes(min + ((h + 8) * 60))
    } else if (f == '+') {
      date.setMinutes(min + (-1 * (h - 8) * 60));
    }
    return date.toISOString()
  },
  /**
    * 取消约课时 如果是学生时区的取消约课处理
    * @param {Date} time 需要进行处理的日期对象
    * @param {*} f 运算符
    * @param {*} h 学生用户时区距离UTC相差的时间
    */
  cencelTimes(time, f, h) {
    var date = new Date(time)
    var min = date.getMinutes()
    if (f == '-') {
      date.setMinutes(min + (h * 60) + (h * 60) + (8 * 60))
    } else {
      date.setMinutes(min + (1 * (h - 8) * 60));
    }
    return date.toISOString()
  },
  /**
    * 约多节和取消多节时结束时间的处理（+55分钟）
    * @param {Date} time 多次约课或者多次取消时 结束的时间的日期对象
    */
  endTimeAdd55(time) {
    var date = new Date(time)
    var min = date.getMinutes()
    date.setMinutes(min + 55);
    return date.toISOString()
  },
  addTime12Hours(time) {
    var date = new Date(time)
    var min = date.getMinutes()
    date.setMinutes(min + 12 * 60);
    return date
  },
  getTimeZone() {
    let date = (new Date()).toString().substring(28);
    let arr = date.split('(');
    let times = arr[0].replace(' ', '');
    let time = times.substring(0, 3) + times.substring(3)
    // return arr[1].replace(')',' ') + time;
    return time
  },
  beforeYears(date, years) {
    let nowYeal = new Date().getFullYear()
    return new Date(new Date().setFullYear(nowYeal - years)).toISOString()
  },
  // n7 上周的开始时间 n1 上周的结束时间 n0 本周的开始时间  -6本周的结束时间  n-7下周的开始时间 -13下周结束时间
  getWeekTime(n) {
    var now = new Date();
    var year = now.getFullYear();
    //因为月份是从0开始的,所以获取这个月的月份数要加1才行
    var month = now.getMonth() + 1;
    var date = now.getDate();
    var day = now.getDay();
    //判断是否为周日,如果不是的话,就让今天的day-1(例如星期二就是2-1)
    if (day !== 0) {
      n = n + (day - 1);
    } else {
      n = n + day;
    }
    if (day) {
      //这个判断是为了解决跨年的问题
      if (month > 1) {
        month = month;
      }
      //这个判断是为了解决跨年的问题,月份是从0开始的
      else {
        year = year - 1;
        month = 12;
      }
    }
    now.setDate(now.getDate() - n);
    year = now.getFullYear();
    month = now.getMonth() + 1;
    date = now.getDate();
    var s = year + "-" + (month < 10 ? ('0' + month) : month) + "-" + (date < 10 ? ('0' + date) : date);
    return new Date(s).toISOString();
  },
  // 任意月的最后一天
  getLastDay(d) {
    var current = new Date(d);
    var currentMonth = current.getMonth();
    var nextMonth = ++currentMonth;
    var nextMonthDayOne = new Date(current.getFullYear(), nextMonth, 1);
    var minusDate = 1000 * 60 * 60 * 24;
    return new Date(nextMonthDayOne.getTime() - minusDate);
  },
  /**
   * 计算年龄
   * @param {Date} strBirthday 出生日期
   */
  birthdayMapToAge(strBirthday) {
    if (strBirthday != null) {
      let bir = new Date(strBirthday)
      let returnAge,
        birthYear = bir.getFullYear(),
        birthMonth = bir.getMonth()+1,
        birthDay = bir.getDate(),
        d = new Date(),
        nowYear = d.getFullYear(),
        nowMonth = d.getMonth() + 1,
        nowDay = d.getDate();
      if (nowYear == birthYear) {
        returnAge = 0;//同年 则为0周岁
      }
      else {
        let ageDiff = nowYear - birthYear; //年之差
        if (ageDiff > 0) {
          if (nowMonth == birthMonth) {
            let dayDiff = nowDay - birthDay;//日之差
            if (dayDiff < 0) {
              returnAge = ageDiff - 1;
            } else {
              returnAge = ageDiff;
            }
          } else {
            let monthDiff = nowMonth - birthMonth;//月之差
            if (monthDiff < 0) {
              returnAge = ageDiff - 1;
            }
            else {
              returnAge = ageDiff;
            }
          }
        } else {
          returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天
        }
      }
      return returnAge;//返回周岁年龄
    } else {
      return ''
    }
  },

  getQuarterStartMonth() {
    var quarterStartMonth = 0;
    if (nowMonth < 3) {
      quarterStartMonth = 0;
    }
    if (2 < nowMonth && nowMonth < 6) {
      quarterStartMonth = 3;
    }
    if (5 < nowMonth && nowMonth < 9) {
      quarterStartMonth = 6;
    }
    if (nowMonth > 8) {
      quarterStartMonth = 9;
    }
    return quarterStartMonth;
  },
  getWeekStartDate() {
    var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
    return weekStartDate
  },
  //获得本周的结束日期
  getWeekEndDate() {
    var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek), 23, 59, 59);
    return weekEndDate
  },
  //获得本月的开始日期
  getMonthStartDate() {
    var monthStartDate = new Date(nowYear, nowMonth, 1);
    return monthStartDate
  },
  //获得本月的结束日期
  getMonthEndDate() {
    var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth), 23, 59, 59);
    return monthEndDate
  },
  //获得上月开始时间
  getLastMonthStartDate() {
    if (lastMonth === 11) {
      var lastMonthStartDate = new Date(nowYear - 1, lastMonth, 1);
    } else {
      var lastMonthStartDate = new Date(nowYear, lastMonth, 1);
    }
    return lastMonthStartDate
  },
  //获得上月结束时间
  getLastMonthEndDate() {
    if (lastMonth === 11) {
      var lastMonthEndDate = new Date(nowYear - 1, lastMonth, getMonthDays(lastMonth), 23, 59, 59);
    } else {
      var lastMonthEndDate = new Date(nowYear, lastMonth, getMonthDays(lastMonth), 23, 59, 59);
    }
    return lastMonthEndDate
  },
  //获得本季度的开始日期
  getQuarterStartDate() {
    var quarterStartDate = new Date(nowYear, getQuarterStartMonth(), 1);
    return quarterStartDate
  },
  //或的本季度的结束日期
  getQuarterEndDate() {
    var quarterEndMonth = getQuarterStartMonth() + 2;
    var quarterStartDate = new Date(nowYear, quarterEndMonth, getMonthDays(quarterEndMonth), 23, 59, 59);
    return quarterStartDate
  },
  // 获取某个月的开始和结束时间
  getAnyMouthStartAndEnd(date, justToNow) {
    let nowMonth = new Date(date).getMonth(); //当前月
    let nowYear = new Date(date).getYear(); // 当前年
    nowYear += (nowYear < 2000) ? 1900 : 0;
    var startTime = new Date(nowYear, nowMonth, 1);
    var endTime = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
    endTime.setHours(23)
    endTime.setMinutes(59)
    endTime.setSeconds(59)
    if (nowMonth === new Date().getMonth()) {
      return {
        startTime: startTime.toISOString(),
        endTime: new Date().toISOString()
      }
    } else {
      return {
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString()
      }
    }
  },

  getNextHalfHour() {
    const now = new Date();
    const minutes = now.getMinutes();
    const nextHalfHour = minutes < 30 ? 30 : 60; // 判断是下一个半点还是整点

    // 设置分钟为下一个半点或整点
    now.setMinutes(nextHalfHour, 0, 0);
    return now;
}
}
