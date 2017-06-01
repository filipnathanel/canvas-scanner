import {extend} from './utils';

function Ajax(options){

    this._init(options);

}

Ajax.prototype = {

    // DEFAULTS
    defaults: {
        defaultHeaders:{
            'Content-Type': 'application/json'
        }
    },
    
    _init:function(options){
        this.options = extend(this.defaults, options);
    },
    $get: function(url, cache = false){

        var self = this;

        var promise = new Promise( function (resolve, reject){

            var c = new XMLHttpRequest();

            c.open('GET', url, true);
            
            for (var prop in self.options.headers){
                c.setRequestHeader(prop, self.options.headers[prop]);
            }
            // if the Content-Type header wasn't set
            if ( !( self.options.headers && self.options.headers['Content-Type']) ){
                c.setRequestHeader('Content-Type', 'application/json'); 
            }
          
            c.responseType = self.options.responseType ? self.options.responseType : 'json';
            c.timeout = 20000;
            c.send();

            c.onreadystatechange = function(){
                if (c.readyState==4){
                    if (c.status === 200){
                        
                        // IE Workaround
                        var response ;
                        if ( c.responseType === 'json' ){
                            response = c.response;
                        } else if ( c.responseType === 'text' ){
                            response = c.response;
                        }
                       
                        resolve(response);    

                    } else {
                        reject(c.statusText);
                    }
                }
            }

            c.ontimeout = function(){
                reject(c.statusText);
            }

        });

        return promise;

    },

    /**
     * Creates Get Parameter for melloAction
     * @param  {object} data property name will become GET variable name
     *                       property value will become GET value
     * @return {string}      GET string
     */
   _createData: function(data, post = false){ //this is unfinished
 
        var params = "";

        if ( typeof data === "object"){
            for (var prop in data){
                params += encodeURIComponent(prop) + "=" + encodeURIComponent( data[prop] ) + "&";
            }
        } 

        return post ? params.slice(0, -1) : '?' + params.slice(0, -1);
        
    },

    restOptionsToUrl: function(options){

        var resources = '';

        if ( typeof options.data === "string"){
            resources = options.data;
        } else if ( typeof options.data === "object" && options.data.length){
            resources = options.data.join('/');
        }

        return options.base + resources ;

    },

    get: function(url, data){

        var params = "";

        if(data){
            params = this._createData(data);

        }

        return this.$get(url + params);
    },

    post:function(url, data){

        var params = "";

        if(data){
            params = this._createData(data, true);

        }

        return this.$post(url,params);
    },

    getREST:function(options){

        var url = this.restOptionsToUrl(options);

        return this.$get(url);
    }
    
}

export default Ajax;