import { request } from './request'
import config from './config'
import { random, cipher } from './wenshu_raw';

// console.log(cipher());

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
 * 查询文档接口 搜索接口
 * @param {*} param0 
 * @param {Object} 需要附加到请求里的参数
 * @returns 
 */
export function queryDoc({ pageId, sortFields, pageNum, queryCondition, requestToken }, extra = {}) {
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
      ciphertext: cipher(),
      pageNum: pageNum || 1,
      queryCondition,
      "__RequestVerificationToken": requestToken || random(24),
      wh: 778,
      ww: 1507,
      cs: 0,
      ...extra
    }
  })
}