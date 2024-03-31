import { JSEncrypt } from "./custom_jsencrypt"
import md5 from "crypto-js/md5"
import axios from "axios"
import { request } from "./request"
import { cipher, DES3, random } from "./wenshu_raw"

/**
 *
 * 只有这个接口鉴别为正常用户 而非匿名用户才可激活
 *  
 * 怎么鉴别为正常用户？
 */
export function currentUser({ pageId, requestToken, extra }) {
    return new Promise(async (resolve) => {
        try {
            const r = await axios.request({
                //   url: "https://wenshu.liaoxiaojie.cn:9020/website/parse/rest.q4w",
                url: "/website/parse/rest.q4w",
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
                data: {
                    pageId,
                    cfg: "com.lawyee.wbsttools.web.parse.dto.AppUserDTO@currentUser",
                    "__RequestVerificationToken": requestToken,
                    wh: 778,
                    ww: 1507,
                    cs: 0,
                    ...extra
                }
            })
            if (r.status !== 200) {
                resolve({ code: r.status, success: false, msg: r.statusText })
            }
            if (r?.data?.result?.userId === "anonymousUser") {
                resolve({ code: r.data.code, success: false, msg: "匿名用户" })
            }
            resolve({ code: r.data.code, success: r.data.success, msg: r.data.description })
        } catch (err) {
            resolve({ code: 999, success: false, msg: err.toString() })
        }
    })
}

/**
 * 登录
 * @returns Promise<Object>
 */
export function login({ username, password }) {
    return new Promise(async (resolve) => {
        try {
            // 1 获取提权 URL 
            const r = await axios.request({
                method: "POST",
                // url: "https://wenshu.court.gov.cn/tongyiLogin/authorize",
                // url: "https://wenshu.liaoxiaojie.cn:9020/tongyiLogin/authorize",
                url: "/tongyiLogin/authorize",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                }
            })
            if (r.status !== 200) {
                resolve({ code: r.status, success: false, msg: r.statusText })
            }
            const redirectUrl = r.data;
            console.log(`提权 URL ${redirectUrl}`)
            // 2 正常登录接口 获取 HOLDON KEY
            const r2 = await axios.request({
                method: "POST",
                // url: "https://account.court.gov.cn/api/login",
                // url: "https://account.wenshu.liaoxiaojie.cn:9021/api/login",
                url: "/api/login",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
                data: {
                    username, password,
                    appDomain: "wenshu.court.gov.cn"
                }
            })
            if (r2.status !== 200) {
                resolve({ code: r2.status, success: false, msg: r2.statusText })
            }
            if (!r2.data.success) {
                resolve({ code: r2.data.code, success: false, msg: r2.data.message })
            }
            // 3 
            const u1 = redirectUrl.replace("https://account.court.gov.cn", "")
            console.log(`u1: ${u1}`)
            const r3 = await axios.get(u1, {}) // 文书网会返回重定向，后端将重定向转为 200 了
            console.log(r3)
            if (r3.status !== 200) {
                resolve({ code: r3.status, success: false, msg: r3.statusText })
            }
            const l1 = r3.headers.location // 
            const l2 = l1.replace("https://wenshu.court.gov.cn", "")
                .replace("https://account.court.gov.cn", "")
            console.log(`[custom redirect] l1: ${l1}, l2: ${l2}`)
            const r4 = await axios.get(l2, {})
            console.log(r4)
            if (r4.status !== 200) {
                resolve({ code: r4.status, success: false, msg: r4.statusText })
            }
            resolve({ code: 0, success: true, msg: "登录成功" })
        } catch (err) {
            console.error(err)
            resolve({ code: 999, success: false, msg: err.msg })
        }
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

/**
 * 查询文档接口 搜索接口
 * @param {*} param0 
 * @param {Object} 需要附加到请求里的参数
 * @returns 
 */
export function queryDoc({ pageId, sortFields, pageNum, pageSize, queryCondition, requestToken }, extra = {}) {
    return new Promise(async (resolve) => {
        try {
            const r = await axios.request({
                url: "/website/parse/rest.q4w",
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                },
                data: {
                    cfg: "com.lawyee.judge.dc.parse.dto.SearchDataDsoDTO@queryDoc",
                    pageId,
                    sortFields,
                    ciphertext: cipher(),
                    pageNum: pageNum || 1,
                    pageSize: pageSize || 10,
                    queryCondition,
                    "__RequestVerificationToken": requestToken || random(24),
                    wh: 778,
                    ww: 1507,
                    cs: 0,
                    ...extra
                }
            })
            // console.log(r)
            if (r.status !== 200) {
                resolve({ code: r.status, success: false, msg: r.statusText })
            }
            // IMPORTANT 响应了 200 可能是后端改的，实际可能是重定向，这时候需要手动处理
            if (r.statusText === "redirect") {
                // const result = await queryDoc({ pageId, sortFields, pageNum, pageSize, queryCondition, requestToken }, {})
                resolve({ code: 998, success: false, msg: "redirect response" })
            }
            if (!r.data.success) {
                resolve({ code: r.data.code, success: false, msg: r.data.message })
            }
            if (r.data.secretKey) { // 返回了secretKey，说明返回的内容是需要解密的
                let decryptedResult = DES3.decrypt(r.data.result, r.data.secretKey)
                try { decryptedResult = JSON.parse(decryptedResult) } catch (e) { } // 尝试解析为JSON对象
                r.data.result = decryptedResult
            }
            resolve({ code: 0, success: true, msg: r.data.message, data: r.data })
        } catch (err) {
            resolve({ code: 999, success: false, msg: err.toString() })
        }
    })

}

/**
 * 获取文档信息接口
 * @param {*} param0 
 * @param {Object} 需要附加到请求里的参数
 * @returns 
 */
export function docDetail({ docId, requestToken }, extra = {}) {
    return new Promise(async (resolve) => {
        const r = await axios.request({
            url: "/website/parse/rest.q4w",
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            data: {
                cfg: "com.lawyee.judge.dc.parse.dto.SearchDataDsoDTO@docInfoSearch",
                docId,
                ciphertext: cipher(),
                "__RequestVerificationToken": requestToken || random(24),
                wh: 778,
                ww: 1507,
                cs: 0,
                ...extra
            }
        })
        console.log(r)
        if (r.status !== 200) {
            resolve({ code: r.status, success: false, msg: r.statusText })
        }
        // IMPORTANT 响应了 200 可能是后端改的，实际可能是重定向，这时候需要手动处理
        if (r.statusText === "redirect") {
            resolve({ code: 998, success: false, msg: "redirect response" })
        }
        if (!r.data.success) {
            resolve({ code: r.data.code, success: false, msg: r.data.message })
        }
        if (r.data.secretKey) { // 返回了secretKey，说明返回的内容是需要解密的
            let decryptedResult = DES3.decrypt(r.data.result, r.data.secretKey)
            try { decryptedResult = JSON.parse(decryptedResult) } catch (e) { } // 尝试解析为JSON对象
            r.data.result = decryptedResult
        }
        resolve({ code: 0, success: true, msg: r.data.message, data: r.data })
    })
}
