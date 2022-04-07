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