import { LOGIN_URL } from '../../utils/constant'
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
        username: "17674663799",
        password: "j0khubk9dhIOu6ToNrIEpmZJnv11Gwd8ZKFR%2FhFpJKjUQ08Rob6oEPBzBgQf3lZ3o7frz1trG3Uf%2FiaUebbbAhOYLIK5qQf5tFUVbwOoXZOEuv1pxBBzTLkvOZ3Y8UqO7%2FBhbvoYn%2BD52MS%2BODGr3ds3g6FLa3hPI0pKV8qaB32%2Bn0GjgRH%2BPuFRlssqu%2B0r%2BJaxYCg94SDKhsiCa7%2BAto%2FdtQ0Pf0n3yJvnch%2BRO03BpzChi8%2FS3gbM%2FXtjWL1TvlEIA3io3SymfJtpl4wteA6mfxaMXtRPwT%2BJpcdGbX6cmX086xuMX7a%2FzIzxgM4NPq4MlhFjA5cv95J23K%2F2AA%3D%3D",
        appDomain: "wenshu.court.gov.cn"
      }
    })
    console.log(resp)
  }
})
