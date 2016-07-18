import * as utils from '../utils/utils';
import Circle from './Circle';
import Path from './Path';

export default class PathData  {
	constructor(svg){

		this.$svg = svg;
		this.data = utils.SortedArray.comparing( (point) => {
			return point.x
		}, [] );
		// return utils.SortedArray.comparing( (item) => {return item.options.cx;}, []);
		

		// super();
		// // mozemy Tej tablicy dawac różne typy jako wierzchołki
		// // ale w naszym wypadku to będą tylko Pointy
		// return utils.SortedArray.comparing( (item) => {
		// 	return item.options.cx;
		// }, []);

	}

	addPoint(x, y){

		var point = new Circle({
			cx: x,
			cy: y,
			r: 4,
			fill: 'red'
		}, this.$svg);

		point.x = x;
		point.y = y;

		this.data.insert(point);

		this.addPaths();
	}

	// temp function 
	getPathAtX(x){

		var dataLen = this.data.array.length;

		for (var i = 0; i < dataLen; i++) {

			if( this.data.array[i+1] ){
				if ( x >= this.data.array[i].x && x < this.data.array[i+1].x ){
					return this.data.array[i];
				}
			} else {
				return this.data.array[dataLen - 1 ];
			}
			
		}
		
	}

	addPaths(){

		// rest Paths
		this.removePaths();

		var len = this.data.array.length;
		var loopTo = len -1;

		if (len > 1){

			// this.data.forEach( (point) => {
			// do some shit for every point but the last one

			for (var i = 0; i < loopTo; i++) {

				var d = `M${this.data.array[i].x} ${this.data.array[i].y} L${this.data.array[i+1].x} ${this.data.array[i+1].y} Z`;

				var path = new Path({
					'd':d,
					'stroke':'blue',
					'stroke-width':'1'
				}, this.$svg);

				this.data.array[i].path = path;

				// this.paths.push(path);
				// console.log(path.el);
			}

			// this.points.array[loopTo];
		}
	}

	removePaths(){

		this.data.array.forEach( (item) => {

			if (item.path){
				item.path.el.remove();
			}

		});

	}

}