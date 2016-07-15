import SVGElement from './svgElement';

export default class Circle extends SVGElement {
	
	constructor(options, $svg){

		super();

		this.defaults = {
			cx:0,
			cy:0,
			r:1,
			fill: '#fff',
			// strokeWidth:1,
			// stroke:'#000'
		}

		this.init(options);



		// // set constructor options as attributes;
		// Object.keys( this.options ).forEach( (k, i) => {
		// 	this.el.setAttribute(k, this.options[k]);
		// });

		// default options ( could be handled better )

		if ($svg){
			$svg.appendChild(this.el);
		}

	}

}