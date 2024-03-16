import { JSEncrypt } from "./custom_jsencrypt"
import md5 from "crypto-js/md5"
import CryptoJS from "crypto-js"

/**
 * 检查用户是否已经登录
 * @returns Promise<bool>
 */
export function checkLogin() {
    return new Promise((resolve) => {
        // TODO
        resolve(false)
    })
}

/**
 * 登录
 * @returns Promise<Object>
 */
export function login({ username, password }) {
    return new Promise((resolve) => {
        // TODO
        resolve({ code: 1, success: true })
    })
}

const PUBKEY = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5GVku07yXCndaMS1evPIPyWwhbdWMVRqL4qg4OsKbzyTGmV4YkG8H0hwwrFLuPhqC5tL136aaizuL/lN5DRRbePct6syILOLLCBJ5J5rQyGr00l1zQvdNKYp4tT5EFlqw8tlPkibcsd5Ecc8sTYa77HxNeIa6DRuObC5H9t85ALJyDVZC3Y4ES/u61Q7LDnB3kG9MnXJsJiQxm1pLkE7Zfxy29d5JaXbbfwhCDSjE4+dUQoq2MVIt2qVjZSo5Hd/bAFGU1Lmc7GkFeLiLjNTOfECF52ms/dks92Wx/glfRuK4h/fcxtGB4Q2VXu5k68e/2uojs6jnFsMKVe+FVUDkQIDAQAB`
const encryptor = new JSEncrypt()
encryptor.setPublicKey(PUBKEY)

/**
 * 文书网的密码加密，非对称的
 * @param {*} pwd 
 * @returns 
 */
export function encryptPwd(pwd) {
    return encodeURIComponent(encryptor.encrypt(pwd))
}

/**
 * 加密密码用以存储在本地，对称加密
 * @param {*} pwd 
 * @param {*} secretKey 
 * @returns {String} 加密的密码
 */
export function encryptPwdAes(pwd, username) {
    return btoa(pwd) + md5(username);
}

/**
 * 对称解密
 * @param {*} pwd 
 * @param {*} username 
 * @returns {String} 解密的密码
 */
export function decryptPwdAes(encryptedPwd, username) {
    const ep = encryptedPwd.replace(md5(username), "")
    return atob(ep)
}
