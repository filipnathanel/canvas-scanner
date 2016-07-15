/**
 * Merge defaults with user options
 * @param {Object} defaults Default settings
 * @param {Object} options User options
 * @returns {Object} Merged values of defaults and options
 */
export function extend( defaults, options ) {
    // ES6
    if (typeof Object.assign === 'function'){
        return Object.assign({},defaults,options);
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
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight || e.clientHeight || g.clientHeight;
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
        if(el.indexOf('#') == 0){
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