
/**
 * @returns Promise
 */
export function request({ url, method, data, header }) {
  if (!url.includes("login")) { // 非登录接口加上用户凭证
    let [wzws_sessionid, HOLDONKEY] = wx.batchGetStorageSync(["wzws_sessionid", "HOLDONKEY"])
    header['Cookie'] = `wzws_sessionid=${wzws_sessionid}; HOLDONKEY=${HOLDONKEY}`
  }
  return new Promise((resolve, reject) => {
    wx.request({
      method, url, data, header,
      success: function (data) {
        if (data?.data?.code === "NOT_LOGIN") {
          wx.removeStorageSync("wzws_sessionid")
          wx.removeStorageSync("HOLDONKEY")
          reject(data)
          return
        }
        if (data?.data?.success) {
          resolve(data)
          return
        }
        reject(data)
      },
      fail: function (err) {
        reject(err)
      }
    })
  })
}