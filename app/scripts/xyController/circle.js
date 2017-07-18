import SVGElement from './svgElement';

export default class Circle extends SVGElement {

	constructor( options, $svg ) {

		super();

		this.defaults = {
			name: 'circle'
		};

		this.attributes = {
			cx: 0,
			cy: 0,
			r: 1,
			fill: '#fff',
		};

		this.init( options );

		if ( $svg ) {

			$svg.appendChild( this.el );

		}

	}

}