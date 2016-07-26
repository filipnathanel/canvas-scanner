import * as utils from '../utils/utils';
import SVGUtils from '../utils/svgUtils';
import Circle from './Circle';
import Path from './Path';

export default class PathData  {
	constructor(svg){

		this.$svg = svg;
		// this.data = utils.SortedArray.comparing( (point) => {

		// 	return point.x
		// }, [] );

		this.data = new utils.SortedArray([], function(a,b){		
	        if (a.x === b.x) {
	        	if (a.y === b.y){
	        		return 0
	        	}else{
	        		return a.y < b.y ? -1 : 1;
	        	}
	        }
	        return a.x < b.x ? -1 : 1;
		});

		// this.onPointLeftClick = this.onPointLeftClick.bind(this);

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

		point.el.addEventListener('mousedown', (e) => {
			this.onPointLeftClick(e, point)	
		});
		point.el.addEventListener('contextmenu', (e) => {this.onPointRightClick(e);} )

		this.data.insert(point);

		this.addPaths();
	}

	onPointLeftClick(e, point){


		var self = this;
		var selectedPoint = event.target;

		// var dataPointIndex = this.data.search(point)
		// var dataPoint = this.data.array[dataPointIndex];

		// console.log(dataPoint);
		
		var clickPos = SVGUtils.mousePos(e, this.$svg);
		var posDiff = { 
			x: selectedPoint.getAttribute('cx') - clickPos.x,
			y: selectedPoint.getAttribute('cy') - clickPos.y
		}

		function dragHandler(e) {

			self.data.remove(point);

			var movePos = SVGUtils.mousePos(e, self.$svg),
				xPos = movePos.x + posDiff.x,
				yPos = movePos.y + posDiff.y;

			point.setOption('cx', xPos);
			point.setOption('cy', yPos);

			point.x = xPos;
			point.y = yPos;

			var newPoint = point;

			self.data.insert(newPoint);

			self.addPaths();

		}
		// attach drag handler
		this.$svg.addEventListener('mousemove', dragHandler);

		function onMouseUp(){
			// selectedPoint.removeEventListener('mousedown', this.onPointLeftClick);
			console.log('removedEvent');
			self.$svg.removeEventListener('mousemove', dragHandler);
			selectedPoint.removeEventListener('mouseup', onMouseUp);
		}
		selectedPoint.addEventListener('mouseup', onMouseUp);


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

			for (var i = 0; i < loopTo; i++) {

				var d = `M${this.data.array[i].x} ${this.data.array[i].y} L${this.data.array[i+1].x} ${this.data.array[i+1].y} Z`;

				var path = new Path({
					'd':d,
					'stroke':'blue',
					'stroke-width':'1'
				}, this.$svg, true);

				this.data.array[i].path = path;

			}

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