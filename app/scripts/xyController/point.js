export default class Point {

	constructor( x = 0, y = 0, context ) {

		this.x = x;
		this.y = y;

		this.radius = 2;
		this.fill = '#ee4040';

		if ( context ) {

			this.context = context;
			this.draw();

		}

	}

	draw() {

		this.context.beginPath();
		this.context.arc( this.x, this.y, this.radius, 0, 2 * Math.PI, false );
		this.context.fillStyle = this.fill;
		this.context.fill();

	}

	setContext( context ) {

		this.context = context;

	}

}
