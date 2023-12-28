import jsencrypt from './custom_jsencrypt';
import config from './config'
import { request } from './request'

const PUBKEY = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5GVku07yXCndaMS1evPIPyWwhbdWMVRqL4qg4OsKbzyTGmV4YkG8H0hwwrFLuPhqC5tL136aaizuL/lN5DRRbePct6syILOLLCBJ5J5rQyGr00l1zQvdNKYp4tT5EFlqw8tlPkibcsd5Ecc8sTYa77HxNeIa6DRuObC5H9t85ALJyDVZC3Y4ES/u61Q7LDnB3kG9MnXJsJiQxm1pLkE7Zfxy29d5JaXbbfwhCDSjE4+dUQoq2MVIt2qVjZSo5Hd/bAFGU1Lmc7GkFeLiLjNTOfECF52ms/dks92Wx/glfRuK4h/fcxtGB4Q2VXu5k68e/2uojs6jnFsMKVe+FVUDkQIDAQAB`

const encryptor = new jsencrypt.JSEncrypt()
encryptor.setPublicKey(PUBKEY)

function encrypt(str) {
  return encryptor.encrypt(str)
}

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
