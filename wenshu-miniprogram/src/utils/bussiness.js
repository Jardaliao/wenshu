import { request } from './request'
import config from './config'
import { random, cipher } from './wenshu_raw';
import jsencrypt from './custom_jsencrypt';

export const quanwenjiansuo = [
  { key: "s21", text: "全文" },
  { key: "s22", text: "首部" },
  { key: "s53", text: "当事人段" },
  { key: "s23", text: "诉讼记录" },
  { key: "s25", text: "事实" },
  { key: "s26", text: "理由" },
  { key: "s27", text: "判决结果" },
  { key: "s28", text: "尾部" },
  { key: "s54", text: "其他" }];

/**
 * 获取文档信息接口
 * @param {*} param0 
 * @param {Object} 需要附加到请求里的参数
 * @returns 
 */
export function docDetail({ docId, requestToken }, extra = {}) {
  return request({
    url: config.restQ4w,
    method: "POST",
    header: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "origin": "https://wenshu.court.gov.cn"
    },
    data: {
      cfg: "com.lawyee.judge.dc.parse.dto.SearchDataDsoDTO@docInfoSearch",
      docId,
      ciphertext: cipher(),
      "__RequestVerificationToken": requestToken || random(24),
      wh: 778,
      ww: 1507,
      cs: 0,
      ...extra
    }
  })
}

/**
 * 猜测这个接口是用于激活wzws_sessionid和SESSION这两个cookie的
 * 调这个接口在后端激活后，才可以用他们做接下来的查询工作
 * 只有这个接口鉴别为正常用户 而非匿名用户才可激活
 *  
 * 怎么鉴别为正常用户？
 */
export function currentUser({ pageId, requestToken, extra }) {
  return request({
    url: config.restQ4w,
    method: "POST",
    header: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    data: {
      pageId,
      cfg: "com.lawyee.wbsttools.web.parse.dto.AppUserDTO@currentUser",
      "__RequestVerificationToken": requestToken,
      wh: 778,
      ww: 1507,
      cs: 0,
      ...extra
    }
  })
}

/**
 * 获取首页的数据统计
 */
export function wsCountSearch({ requestToken }) {
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
      "__RequestVerificationToken": requestToken,
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
export function queryDoc({ pageId, sortFields, pageNum, pageSize, queryCondition, requestToken }, extra = {}) {
  return request({
    url: config.restQ4w,
    method: "POST",
    header: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "origin": "https://wenshu.court.gov.cn"
    },
    data: {
      cfg: "com.lawyee.judge.dc.parse.dto.SearchDataDsoDTO@queryDoc",
      pageId,
      sortFields,
      ciphertext: cipher(),
      pageNum: pageNum || 1,
      pageSize: pageSize || 5,
      queryCondition,
      "__RequestVerificationToken": requestToken || random(24),
      wh: 778,
      ww: 1507,
      cs: 0,
      ...extra
    }
  })
}

const PUBKEY = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5GVku07yXCndaMS1evPIPyWwhbdWMVRqL4qg4OsKbzyTGmV4YkG8H0hwwrFLuPhqC5tL136aaizuL/lN5DRRbePct6syILOLLCBJ5J5rQyGr00l1zQvdNKYp4tT5EFlqw8tlPkibcsd5Ecc8sTYa77HxNeIa6DRuObC5H9t85ALJyDVZC3Y4ES/u61Q7LDnB3kG9MnXJsJiQxm1pLkE7Zfxy29d5JaXbbfwhCDSjE4+dUQoq2MVIt2qVjZSo5Hd/bAFGU1Lmc7GkFeLiLjNTOfECF52ms/dks92Wx/glfRuK4h/fcxtGB4Q2VXu5k68e/2uojs6jnFsMKVe+FVUDkQIDAQAB`
const encryptor = new jsencrypt.JSEncrypt()
encryptor.setPublicKey(PUBKEY)

export async function checkLogin() {
  const { wzws_sessionid, SESSION } = wx.getStorageSync("cookie")
  if (wzws_sessionid && SESSION) {
    return
  }
  // 登录凭证没了，重新登录
  // 1 请求统一登录接口获取SESSION
  const { data: redirectUrl } = await request({
    url: config.tongyiLoginUrl,
    method: "POST",
    header: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8" // 标准协议中应该是Content-Type，但是小程序只认content-type
    },
  })
  // 2 调登录接口获取 HOLDON KEY
  const resp = await request({
    url: config.loginUrl,
    method: "POST",
    header: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8" // 标准协议中应该是Content-Type，但是小程序只认content-type
    },
    data: {
      username: "17674663791",
      password: encodeURIComponent(encryptor.encrypt("Lj@4536251")),
      appDomain: "wenshu.court.gov.cn"
    }
  })
  if (!resp?.data?.success) {
    console.log("登录失败")
    return
  }
  // 3 调用第一步响应的重定向URL提权 会响应新的session_id
  const rUrl = redirectUrl.replace("https://wenshu.court.gov.cn", "http://wenshu.liaoxiaojie.cn:9020")
    .replace("https://account.court.gov.cn", "http://wenshu.liaoxiaojie.cn:9020")
  const r2 = await request({
    url: rUrl,
    header: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8" // 标准协议中应该是Content-Type，但是小程序只认content-type
    },
  })
}