function isArray (arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
}
function deepClone (obj) {
    if(typeof obj !== "object" && typeof obj !== 'function') {
        return obj;
    }
    var o = isArray(obj) ? [] : {};
    for(i in obj) {
        if(obj.hasOwnProperty(i)){
            o[i] = typeof obj[i] === "object" ? deepClone(obj[i]) : obj[i];
        }
    }
    return o;
}
function deepCopy (origin, obj) {
    for(i in origin){
        if(obj.hasOwnProperty(i)){
            if(typeof obj[i] === "object"){
                if(isArray(origin[i])){
                    origin[i] = deepClone(obj[i]);
                }else{
                    deepCopy(origin[i], obj[i]);
                }
            }else{
                origin[i] = obj[i];
            }
        }
    }
}