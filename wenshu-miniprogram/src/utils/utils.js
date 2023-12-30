export function setDataSync(that, data) {
    return new Promise(function(resolve, reject) {
        that.setData(data, resolve)
    });
}