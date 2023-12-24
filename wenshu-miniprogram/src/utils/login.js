// 导入包
import WxmpRsa from 'wxmp-rsa'
import jsencrypt from './jsencrypt.min'

export const LOGIN_URL = "https://account.court.gov.cn/api/login"
const PUBKEY = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5GVku07yXCndaMS1evPIPyWwhbdWMVRqL4qg4OsKbzyTGmV4YkG8H0hwwrFLuPhqC5tL136aaizuL/lN5DRRbePct6syILOLLCBJ5J5rQyGr00l1zQvdNKYp4tT5EFlqw8tlPkibcsd5Ecc8sTYa77HxNeIa6DRuObC5H9t85ALJyDVZC3Y4ES/u61Q7LDnB3kG9MnXJsJiQxm1pLkE7Zfxy29d5JaXbbfwhCDSjE4+dUQoq2MVIt2qVjZSo5Hd/bAFGU1Lmc7GkFeLiLjNTOfECF52ms/dks92Wx/glfRuK4h/fcxtGB4Q2VXu5k68e/2uojs6jnFsMKVe+FVUDkQIDAQAB`

const rsa = new WxmpRsa({
  default_key_size: 1024,
  default_public_exponent: "010001",
  log: false
})
rsa.setPublicKey(PUBKEY)

console.log(`jsencrypt`)
console.log(jsencrypt)


export function encrypt(str) {
  return rsa.encrypt(str)
}
