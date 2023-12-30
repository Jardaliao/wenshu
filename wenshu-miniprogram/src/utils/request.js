import { DES3 } from "./wenshu_raw";

const cookies = {
  "wzws_sessionid": /wzws_sessionid=([^;]*)/,
  "wzws_cid": /wzws_cid=([^;]*)/,
  "HOLDONKEY": /HOLDONKEY=([^;]*)/,
  "SESSION": /SESSION=([^;]*)/
}

/**
 * @returns Promise
 */
export function request({ url, method, data, header }) {
  if (!header) header = {}
  if (!url.includes("login")) { // 非登录接口加上用户凭证
    const localCookie = wx.getStorageSync("cookie")
    if (localCookie) {
      const attach = [];
      for (let key in cookies) {
        if (key in localCookie) attach.push(`${key}=${localCookie[key]}`)
      }
      header['Cookie'] = attach.join("; ")
    }
  }
  return new Promise((resolve, reject) => {
    wx.request({
      method, url, data, header,
      success: function (body) {
        if (body?.data?.code === "NOT_LOGIN") {
          console.log(`清除所有Storage`)
          wx.removeStorageSync("cookie")
          reject(body)
          return
        }
        if (!body?.data?.success && !url.includes("authorize")) {
          reject(body)
          return
        }
        const setCookie = body.header["Set-Cookie"]
        if (setCookie) { // Set-Cookie
          const newCookie = {};
          for (let key in cookies) {
            const match = setCookie.match(cookies[key])
            if (match) newCookie[key] = match[1]
          }
          if (newCookie) {
            let oldCookie = wx.getStorageSync("cookie")
            if (!oldCookie) oldCookie = {}
            wx.batchSetStorageSync([{ key: "cookie", value: { ...oldCookie, ...newCookie } }])
            console.log(`设置Cookie: ${JSON.stringify(newCookie)}`)
          }
        }
        if (body.data.secretKey) { // 返回了secretKey，说明返回的内容是需要解密的
          let decryptedResult = DES3.decrypt(body.data.result, body.data.secretKey)
          try { decryptedResult = JSON.parse(decryptedResult) } catch (e) { } // 尝试解析为JSON对象
          body.data.result = decryptedResult
        }
        resolve(body)
      },
      fail: function (err) {
        reject(err)
      }
    })
  })
}