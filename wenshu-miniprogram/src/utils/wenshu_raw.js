import CryptoJS from 'crypto-js';

// DES3全局对象
export const DES3 = {
  iv: function () {
    return formatDate(new Date(), "yyyyMMdd")
  },
  encrypt: function (b, c, a) {
    if (c) {
      return CryptoJS.TripleDES.encrypt(b, CryptoJS.enc.Utf8.parse(c), {
        iv: CryptoJS.enc.Utf8.parse(a || DES3.iv()),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }).toString()
    }
    return ""
  },
  decrypt: function (b, c, a) {
    if (c) {
      return CryptoJS.enc.Utf8.stringify(
        CryptoJS.TripleDES.decrypt(b, CryptoJS.enc.Utf8.parse(c),
          { iv: CryptoJS.enc.Utf8.parse(a || DES3.iv()), mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
        )).toString()
    }
    return ""
  }
};

function formatDate(v, format) {
  if (!v) return "";
  var d = v;
  if (typeof v === 'string') {
    if (v.indexOf("/Date(") > -1)
      d = new Date(parseInt(v.replace("/Date(", "").replace(")/", ""), 10));
    else
      d = new Date(Date.parse(v.replace(/-/g, "/").replace("T", " ").split(".")[0]));// 用来处理出现毫秒的情况，截取掉.xxx，否则会出错
  } else if (typeof v === "number") {
    d = new Date(v);
  }
  var o = {
    "M+": d.getMonth() + 1,  // month
    "d+": d.getDate(),       // day
    "h+": d.getHours(),      // hour
    "m+": d.getMinutes(),    // minute
    "s+": d.getSeconds(),    // second
    "q+": Math.floor((d.getMonth() + 3) / 3),  // quarter
    "S": d.getMilliseconds() // millisecond
  };
  format = format || "yyyy-MM-dd";
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return format;
}

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
 * ciphertext生成算法
 */
export function cipher() {
  let now = new Date();
  let timestamp = now.getTime().toString();
  // let salt = $.WebSite.random(24);
  let salt = random(24);
  let year = now.getFullYear().toString();
  let month = (now.getMonth() + 1 < 10 ? "0" + (now.getMonth() + 1) : now.getMonth()).toString();
  let day = (now.getDate() < 10 ? "0" + now.getDate() : now.getDate()).toString();
  let iv = year + month + day;
  let enc = DES3.encrypt(timestamp, salt, iv).toString();
  let str = salt + iv + enc;
  let ciphertext = strTobinary(str);
  return ciphertext;
}

function strTobinary(str) {
  let result = [];
  let list = str.split("");
  for (let i = 0; i < list.length; i++) {
    if (i != 0) {
      result.push(" ");
    }
    let item = list[i];
    let binaryStr = item.charCodeAt().toString(2);
    result.push(binaryStr);
  };
  return result.join("");
}