import { request } from './request'
import config from './config'
import { random, cipher } from './wenshu_raw';
import jsencrypt from './custom_jsencrypt';

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

const PUBKEY = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5GVku07yXCndaMS1evPIPyWwhbdWMVRqL4qg4OsKbzyTGmV4YkG8H0hwwrFLuPhqC5tL136aaizuL/lN5DRRbePct6syILOLLCBJ5J5rQyGr00l1zQvdNKYp4tT5EFlqw8tlPkibcsd5Ecc8sTYa77HxNeIa6DRuObC5H9t85ALJyDVZC3Y4ES/u61Q7LDnB3kG9MnXJsJiQxm1pLkE7Zfxy29d5JaXbbfwhCDSjE4+dUQoq2MVIt2qVjZSo5Hd/bAFGU1Lmc7GkFeLiLjNTOfECF52ms/dks92Wx/glfRuK4h/fcxtGB4Q2VXu5k68e/2uojs6jnFsMKVe+FVUDkQIDAQAB`
const encryptor = new jsencrypt.JSEncrypt()
encryptor.setPublicKey(PUBKEY)

export async function checkLogin() {
  let [wzws_sessionid, HOLDONKEY] = wx.batchGetStorageSync(["wzws_sessionid", "HOLDONKEY"])
  if (wzws_sessionid && HOLDONKEY) {
    return
  }
  // 登录凭证没了，重新登录
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
  if (resp?.data?.success) {
    console.log("登录成功")
  } else {
    console.error("登录失败", JSON.stringify(resp))
  }
}