import axios from "axios";

/**
 * 
 * @param {Object} param
 * @returns 
 */
export function request({ url, method, data, headers }) {
    return new Promise(async (resolve) => {
        try {
            const result = await axios.request({ url, method, data, headers })
            console.log(result)
            if (result.status !== 200) {
                resolve({ success: false, code: result.status, msg: result.statusText })
            }
            
        } catch (err) {
            resolve({ success: false, code: 999, msg: err.msg })
        }
    })
}