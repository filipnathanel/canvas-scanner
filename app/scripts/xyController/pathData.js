import * as utils from '../utils/utils';
import SVGUtils from '../utils/svgUtils';
import Circle from './Circle';
import Path from './Path';

export default class PathData  {
	constructor(svg){

		this.$svg = svg;
		this.data = utils.SortedArray.comparing( (point) => {
			return point.x
		}, [] );

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

		point.el.addEventListener('mousedown', (e) => {this.onPointLeftClick(e);} )
		point.el.addEventListener('contextmenu', (e) => {this.onPointRightClick(e);} )


		this.data.insert(point);

		this.addPaths();
	}

	onPointLeftClick(e){
		var mousePos = SVGUtils.mousePos(e, this.$svg)
		console.log(mousePos);
		console.log(event.target);
		// console.log('left click');
		// console.log(e);
	}
	onPointRightClick(e){
		e.stopPropagation();
		e.preventDefault();

		var mousePos = SVGUtils.mousePos(e, this.$svg)
		console.log('right click');
		console.log(e);
	}

	// temp function 
	getPathAtX(x){

		var dataLen = this.data.array.length;

		for (var i = 0; i < dataLen; i++) {

			if( this.data.array[i+1] ){
				if ( x >= this.data.array[i].x && x < this.data.array[i+1].x ){
					if ( this.data.array[i].x === this.data.array[i+1].x ) {
						return this.data.array[i+1];
						console.log('czlono');
					} else {
						return this.data.array[i];
					}
				}
			} else {
				return this.data.array[dataLen - 1];
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