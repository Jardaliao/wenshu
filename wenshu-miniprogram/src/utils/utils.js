export function setDataSync(data) {
    return new Promise(function(resolve, reject) {
        this.setData(data, resolve)
    });
}