/**
 *  Load Icons ASYNC
 */
export default function loadIcons(cb) {
    var siteUrl = window.location.origin;
    var svgurl = siteUrl + '/images/icons.svg';
    var c = new XMLHttpRequest();
    c.open('GET', svgurl, true);
    c.setRequestHeader('Content-Type', 'text/xml');
    c.send();

    c.onreadystatechange = function(){
        if (c.readyState==4 && c.status==200){
            var svg = c.responseXML.getElementsByTagName('svg')[0];
            svg.style.position = 'absolute';
            svg.style.marginLeft = '-100%';
            document.body.insertBefore(svg, document.body.firstChild);
            if (typeof cb === "function"){
                cb();
            }
        }
    }
}