export function getParamObj(hash, key) {
    var search = decodeURI(hash).split('?')[1]
    if (!search) return null

    var obj = {};
    search.split("&").forEach(function (e) {
        obj[e.split("=")[0]] = e.split("=")[1];
    });
    return obj[key];
}

export function isnumber(val) {
    val = val.replace(/[^0-9]/gi, "");
    // 此处还可以限制位数以及大小
    return val;
}

export function renderTime(date) {
    var dateee = new Date(date).toJSON();
    return new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
}
