import { LOGIN_URL, encrypt } from '../../utils/login'
import { request } from '../../utils/request'

Page({
  async onLoad() {
    const resp = await request({
      url: LOGIN_URL,
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8" // 标准协议中应该是Content-Type，但是小程序只认content-type
      },
      data: {
        username: "17674663791",
        password: encrypt("Lj@4536251"),
        // password: "S4xs0Pi%2Bjjm%2Fl0K%2FS1ZYdj0av8LK9PYrZyVRPLvc74d2Cgt4GK5mv82AieavX2eYH596CWM14GzaNlCxE71W87hStwbXnpApEvVHryW9%2B%2FK0R0F5PrdqcjwxaWDCuWNXmHVbIds9EBqfabIs7QBiAev0BE2KnLZ%2FzD33rE0jHW7dS1%2FLWmJTbuk7hEkqLCkzN48upemlNRSoDzDLHTuIDPks3CVUZMxRQiJyTpXePVkAhMmqiTO648Jv5NWkEhGQe3ejFMJmdZe74xZl0tD1lcqqjvfQ%2BLQSTZzmBDctkR2hlGfJfahj254Y%2FRAeoS2rIrOtxkd04tnbX0lhTRyhLA%3D%3D",
        appDomain: "wenshu.court.gov.cn"
      }
    })
    console.log(resp)
    // console.log(encrypt(`12312312312`))
  }
})
