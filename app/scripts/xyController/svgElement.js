import * as utils from  '../utils/utils';

export default class SVGElement{
	
	constructor(options, $svg){

		this._defaults = {
			namespace: 'http://www.w3.org/2000/svg'
		};

	}

	get defaults(){
		return this._defaults;
	}

	set defaults(defaults){
		if (this._defaults){
			this._defaults =  utils.extend(this._defaults, defaults);
		} else{
			this._defaults = defaults;
		}
	}

	init(options){

		this.options = utils.extend( this.defaults, options);
		this.el = this.createEl();
		this.mapOptionsToAttributes();
	}

	mapOptionsToAttributes(){
		Object.keys( this.options ).forEach( (k, i) => {
			this.el.setAttribute(k, this.options[k]);
		});
	}

	createEl(){
		return document.createElementNS(this.options.namespace, this.constructor.name.toLowerCase());
	}

	setOption(optionName, optionVal){
		this.options[optionName] = optionVal;
		this.mapOptionsToAttributes();
	}

}