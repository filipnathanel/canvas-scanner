import * as utils from '../utils/utils';

export default class SVGElement {

	constructor( options, $svg ) {

		this._defaults = {
			namespace: 'http://www.w3.org/2000/svg'
		};

	}

	get defaults() {

		return this._defaults;

	}

	set defaults( defaults) {

		if ( this._defaults ) {

			this._defaults =  utils.extend( this._defaults, defaults );

		} else {

			this._defaults = defaults;

		}

	}

	get attributes() {

		return this._attributes;

	}

	set attributes( attributes ) {

		if ( this._attributes ) {

			this._attributes =  utils.extend( this._attributes, attributes );

		} else {

			this._attributes = attributes;

		}
	}

	init( options, attributes ) {

		this.options = utils.extend( this.defaults, options );
		this.attributes = utils.extend( this.attributes, options );
		this.el = this.createEl();
		this.mapAttributes();

	}

	mapAttributes() {

		Object.keys( this.attributes ).forEach( ( k, i ) => {

			this.el.setAttribute( k, this.attributes[k] );

		} );

	}

	createEl() {

		return document.createElementNS( this.options.namespace, this.options.name );

	}

	setAttribute( attributeName, attributeVal ) {

		this.attributes[attributeName] = attributeVal;
		this.mapAttributes();

	}

}
