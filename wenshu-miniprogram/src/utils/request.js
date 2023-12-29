const cookies = new Map([
  ["wzws_sessionid", /wzws_sessionid=([^;]*)/],
  ["wzws_cid", /wzws_cid=([^;]*)/]
  ["HOLDONKEY", /HOLDONKEY=([^;]*)/],
  ["SESSION", /SESSION=([^;]*)/],
]);

/**
 * @returns Promise
 */
export function request({ url, method, data, header }) {
  if (!header) header = {}
  if (!url.includes("login")) { // 非登录接口加上用户凭证
    const localCookie = wx.getStorageSync("cookie")
    if (localCookie) {
      const attach = [];
      for (let [key, value] of cookies) {
        if (key in localCookie) attach.push(`${key}=${localCookie[key]}`)
      }
      header['Cookie'] = attach.join("; ")
    }
  }
  return new Promise((resolve, reject) => {
    wx.request({
      method, url, data, header,
      success: function (data) {
        if (data?.data?.code === "NOT_LOGIN") {
          console.log(`清除所有Storage`)
          wx.removeStorageSync("cookie")
          reject(data)
          return
        }
        if (!data?.data?.success) {
          reject(data)
          return
        }
        const setCookie = resp.header["Set-Cookie"]
        if (setCookie) { // Set-Cookie
          const newCookie = {};
          for (let [key, value] of cookies) {
            const match = setCookie.match(value)
            if (match) newCookie[key] = match[1]
          }
          if (newCookie) {
            let oldCookie = wx.getStorageSync("cookie")
            if (!oldCookie) oldCookie = {}
            wx.batchSetStorageSync([{ key: "cookie", value: { ...oldCookie, ...newCookie } }])
            console.log(`设置Cookie: ${JSON.stringify(newCookie)}`)
          }
        }
        resolve(data)
      },
      fail: function (err) {
        reject(err)
      }
    })
  })
}