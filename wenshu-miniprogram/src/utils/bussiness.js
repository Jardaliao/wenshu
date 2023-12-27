import { request } from './request'
import config from './config'

export function index() {
  return request({
    url: config.indexUrl,
    method: "GET",

  })
}

/**
 * 从网站扒下来的随机算法
 * @param {int} size 
 */
function random(size) {
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