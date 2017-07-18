import SVGElement from './svgElement';

export default class Path extends SVGElement {

	constructor( options, $svg, prepend ) {

		super();

		this.defaults = {
			name: 'path'
		};

		this.attributes = {
			stroke: '#000',
			'stroke-width': 1,
			fill: 'none'
		};

		this.init( options );

		if ( $svg ) {

			if ( prepend && $svg.childNodes.length > 0 ) {

				$svg.insertBefore( this.el, $svg.childNodes[0] );

			} else {

				$svg.appendChild( this.el );

			}

		}

	}

}
