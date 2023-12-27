import { encrypt } from '../../utils/login'
import { request } from '../../utils/request'
import config from '../../utils/config'
import { wsCountSearch } from '../../utils/bussiness'

Page({
  async onLoad() {
    await this.checkLogin()
    console.log(await wsCountSearch())
  },
  async checkLogin() {
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
        password: encodeURIComponent(encrypt("Lj@4536251")),
        appDomain: "wenshu.court.gov.cn"
      }
    })
    if (resp?.data?.success) {
      let setCookie = resp.header["Set-Cookie"]
      try {
        wzws_sessionid = setCookie.match(/wzws_sessionid=([^;]*)/)[1]
        HOLDONKEY = setCookie.match(/HOLDONKEY=([^;]*)/)[1]
      } catch (err) { }
    } else {
      console.error("登录失败", JSON.stringify(resp))
    }
    if (wzws_sessionid && HOLDONKEY) {
      console.log(`登录成功，更新凭证：wzws_sessionid=${wzws_sessionid}, HOLDONKEY=${HOLDONKEY}`)
      wx.batchSetStorageSync([{ key: "wzws_sessionid", value: wzws_sessionid }, { key: "HOLDONKEY", value: HOLDONKEY }])
    }
  }
})
