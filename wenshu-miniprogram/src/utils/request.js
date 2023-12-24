
/**
 * @returns Promise
 */
export function request({ url, method, data, header }) {
  return new Promise((resolve, reject) => {
    wx.request({
      method, url, data, header,
      success: function (data) {
        resolve(data)
      },
      fail: function (err) {
        reject(err)
      }
    })
  })
}