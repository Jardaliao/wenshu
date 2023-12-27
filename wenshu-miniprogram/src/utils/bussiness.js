import { request } from './request'
import config from './config'

/**
 * 从网站扒下来的随机算法
 * @param {int} size 
 */
export function random(size = 24) {
  let str = "",
    arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  for (var i = 0; i < size; i++) {
    str += arr[Math.round(Math.random() * (arr.length - 1))];
  }
  return str;
}

/**
 * 获取首页的数据统计
 */
export function wsCountSearch() {
  return request({
    url: config.restQ4w,
    method: "POST",
    header: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    data: {
      cfg: "com.lawyee.judge.dc.parse.dto.SearchDataDsoDTO@wsCountSearch",
      // var cs =navigator.cookieEnabled?0:1;
      // var wh = $(window).height(); 
      // var ww = $(window).width(); 
      "__RequestVerificationToken": random(24),
      wh: 778,
      ww: 1507,
      cs: 0,
    }
  })
}

/**
 * 文书网上的页面pageId生成算法
 * @param {*} size 
 * @returns 
 */
export function uuid(size = 32) {
  let guid = "";
  for (let i = 1; i <= size; i++) {
    let n = Math.floor(Math.random() * 16.0).toString(16);
    guid += n;
  }
  return guid;
}

/**
 * 查询文档接口 搜索接口
 * @param {*} param0 
 * @param {Object} 需要附加到请求里的参数
 * @returns 
 */
export function queryDoc({ pageId, sortFields, ciphertext, pageNum, queryCondition, requestToken }, extra = {}) {
  return request({
    url: config.restQ4w,
    method: "POST",
    header: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    data: {
      cfg: "com.lawyee.judge.dc.parse.dto.SearchDataDsoDTO@queryDoc",
      pageId,
      sortFields,
      ciphertext, // TODO
      pageNum: pageNum ? pageNum : 1,
      queryCondition,
      "__RequestVerificationToken": requestToken ? requestToken : random(24),
      wh: 778,
      ww: 1507,
      cs: 0,
      ...extra
    }
  })
}