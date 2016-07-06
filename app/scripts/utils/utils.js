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
            return context.getElementById(el.substr(1));
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