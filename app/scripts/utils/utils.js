/**
 * Merge defaults with user options
 * @param {Object} defaults Default settings
 * @param {Object} options User options
 * @returns {Object} Merged values of defaults and options
 */
export function extend( defaults, options ) {
    // ES6
    if (typeof Object.assign === 'function'){
        return Object.assign({}, defaults, options);
    // ES5
    }else{
        var extended = {};
        var prop;
        for (prop in defaults) {
            if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
                extended[prop] = defaults[prop];
            }
        }
        for (prop in options) {
            if (Object.prototype.hasOwnProperty.call(options, prop)) {
                extended[prop] = options[prop];
            }
        }
        return extended;
    }
};


/**
 * implements foreach for given iterable object/array
 * @param  {iterable} arrayesque any iterable object
 * @return {[type]}            [description]
 */
export function forEach(arrayesque, funct){
    Array.prototype.forEach.call(arrayesque, function(a,b){
        funct(a,b);
    });
}

/*
 * Get Viewport Dimensions
 * returns object with viewport dimensions to match css in width and height properties
 * ( source: http://andylangton.co.uk/blog/development/get-viewport-size-width-and-height-javascript )
 */
export function updateViewportDimensions() {
    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = e.clientWidth || g.clientWidth,
        y = e.clientHeight || g.clientHeight;
    return {
        width: x,
        height: y
    }
}

/**
 * event throttling
 * @param  {Object} ) { var timers [description]
 * @return {void}   
 */
var waitForFinalEvent = (function() {
    var timers = {};
    return function(callback, ms, uniqueId) {
        if (!uniqueId) {
            uniqueId = "Don't call this twice without a uniqueId";
        }
        if (timers[uniqueId]) {
            clearTimeout(timers[uniqueId]);
        }
        timers[uniqueId] = setTimeout(callback, ms);
    };
})();

export {waitForFinalEvent};

/**
 * A shorthand function to get elements whether a single dom element is passed or a string is passed
 * @param  {string or DOMElement} el
 * @param  {DOMElement under which we will look for elements} context 
 * @return {DOMElement} A single element returned by our query
 */
export function getEl(el, context = document){

    if (typeof el === 'string'){
        if(el.indexOf('#') == 0 && el.indexOf(' ') <= 0){
            return document.getElementById(el.substr(1));
        }else{
            return context.querySelector(el);
        }
    } else if (typeof el === 'object'){
        if (el.length){
            console.log('passed el shouldn\'t be iterable');
            return;
        }
        return el;
    }
}

/**
 * A shorthand function to get elements whether a single dom element is passed or a string is passed
 * @param  {string} el
 * @param  {DOMElement under which we will look for elements} context 
 * @return {DOMElement} Iterable elements returned by our query
 */
export function getEls(el, context = document){

    if (typeof el === 'string'){
        if(el.indexOf('.') == 0){
            return context.getElementsByClassName(el.substr(1));
        }else{
            return context.querySelectorAll(el);
        }
    } 
}


/**
 * returns random integer from the range
 * @param  {int} min minimum returned value
 * @param  {int} max maximum returned value
 * @return {int}     the random number
 */
export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// https://github.com/javascript/sorted-array
export class SortedArray {

    constructor(array, compare) {
        this.array   = [];
        this.compare = compare || SortedArray.compareDefault;
        var length   = array.length;
        var index    = 0;

        while (index < length) this.insert(array[index++]);
    }

    insert(element) {
        var array   = this.array;
        var compare = this.compare;
        var index   = array.length;

        array.push(element);

        while (index > 0) {
            var i = index, j = --index;

            if (compare(array[i], array[j]) < 0) {
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
        }

        return this;
    }

    search(element) {
        var array   = this.array;
        var compare = this.compare;
        var high    = array.length;
        var low     = 0;

        while (high > low) {
            var index    = (high + low) / 2 >>> 0;
            var ordering = compare(array[index], element);

                 if (ordering < 0) low  = index + 1;
            else if (ordering > 0) high = index;
            else return index;
        }

        return -1;
    }

    remove(element) {
        var index = this.search(element);
        if (index >= 0) this.array.splice(index, 1);
        return this;
    }

    static comparing (property, array) {
        return new SortedArray(array, function (a, b) {
            return SortedArray.compareDefault(property(a), property(b));
        });
    }

    static compareDefault(a, b) {
        if (a === b) return 0;
        return a < b ? -1 : 1;
    }

}

/**
 * source: http://www.2ality.com/2015/10/concatenating-typed-arrays.html
 * copies an existing array into another  
 * @param  {[type]}    resultConstructor [description]
 * @param  {...[type]} arrays            [description]
 * @return {[type]}                      [description]
 */
export function concatenate(resultConstructor, ...arrays) {
    let totalLength = 0;
    for (let arr of arrays) {
        totalLength += arr.length;
    }
    let result = new resultConstructor(totalLength);
    let offset = 0;
    for (let arr of arrays) {
        result.set(arr, offset);
        offset += arr.length;
    }
    return result;
}

/**
 * This method allows to bypass the Network Error when trying to download
 * a file set <a> element via a.href = canvas.toDataUrl()
 * @param  {dataUrl} dataUrl
 * @return {Blob} a Blob containing the data to Save
 */
export function dataUrlToBlob(dataUrl){
    
    var arr = dataUrl.split(','), 
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
    
    while(n--){
            u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], {type:mime});

}