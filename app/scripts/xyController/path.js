import SVGElement from './svgElement';

export default class Path extends SVGElement {
	
	constructor(options, $svg){

		super();

		this.defaults = {
			'stroke': '#000',
			'stroke-width': 1,
			'fill': 'none'
		};

		this.init(options);

		if ($svg){
			$svg.appendChild(this.el);
		}

	}

}