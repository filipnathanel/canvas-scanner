import Circle from './circle';

export default class PathPoint {
	constructor(x,y){

		this.x = x;
		this.y = y;

		this.Circle = new Circle({
			cx:x,
			cy:y,
			r: 4,
			fill: 'red'
		});
		
	}
}