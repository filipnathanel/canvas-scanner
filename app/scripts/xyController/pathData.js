import * as utils from '../utils/utils';
import SVGUtils from '../utils/svgUtils';
import Circle from './Circle';
import Path from './Path';

export default class PathData  {
	constructor(svg){

		this.$svg = svg;

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

	/**
	 * Add an automation point to the controller
	 * @param {int} x x axis coordinate
	 * @param {int} y y axis coordinate
	 */
	addPoint(x, y, type = 'linear'){

		var point = new Circle({
			cx: x,
			cy: y,
			r: 4,
			fill: 'red',
		}, this.$svg);

		point.x = x;
		point.y = y;
		point.type = type;
		point.slope = 0;

		point.el.addEventListener('mousedown', (e) => {
			this.onPointLeftClick(e, point)	
		});
		point.el.addEventListener('contextmenu', (e) => {this.onPointRightClick(e);} )

		this.data.insert(point);

		this.addPaths();
	}

	/**
	 * Left mouse button click handler (changing position of automation points)
	 * @param  {Event} 	e 		default event passed from EventListenere
	 * @param  {Circle} point 	a Circle object on which the event is invoked
	 * @return {void} 
	 */
	onPointLeftClick(e, point){

		var self = this,
			selectedPoint = event.target,
			clickPos = SVGUtils.mousePos(e, this.$svg),
			posDiff = { 
				x: selectedPoint.getAttribute('cx') - clickPos.x,
				y: selectedPoint.getAttribute('cy') - clickPos.y
			};

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

		function onMouseUp(){
			self.$svg.removeEventListener('mousemove', dragHandler);
			selectedPoint.removeEventListener('mouseup', onMouseUp);
		}

		// attach drag handler
		this.$svg.addEventListener('mousemove', dragHandler);
		// listen for the drag end
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

		this.removePaths();

		var len = this.data.array.length;
		var loopTo = len -1;

		if (len > 1){

			for (var i = 0; i < loopTo; i++) {

				var d = this.createPath( this.data.array[i].type, this.data.array[i].x, this.data.array[i].y, this.data.array[i+1].x, this.data.array[i+1].y, this.data.array[i].slope  );

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

	createPath(type, x1, y1, x2, y2, slope){

		// console.log(slope);
		switch(type){
			// simply create a line from point one to point two
			case 'linear':
				var d = `M${x1} ${y1} L${x2} ${y2}`;
				break;
			case 'quadratic':

				var slopeXMin = y1 >= y2 ? x1 : x2 , // the x1 will always be smaller or equal to x2
					slopeXMax = y1 >= y2 ? x2 : x1 , // the x2 will always be bigger or equal to x1
					slopeYMax = y1 >= y2 ? y1 : y2,
					slopeYMin = y1 >= y2 ? y2 : y1;

				// now the slope will be an number (float?) from range [-50, 50];
				var slope = utils.getRandomInt(-50, 50);

				var slopeYRange = slopeYMax - slopeYMin; 
				var slopeXRange = slopeXMax - slopeXMin;

				if( x1 != x2 && y1 != y2 ){
					var slopeX = x2 - (x2 - x1)/2 + (slopeXRange * slope / 100);
					var slopeY = slopeYMax - (slopeYMax - slopeYMin)/2 + (slopeYRange * slope / 100);
				} else if(y1 != y2 ){
					var slopeX = x1;
					var slopeY = y2 - (y2 - y1)/2 + (slopeYRange * slope / 100);
				} else if (x1 != x2 ){
					var slopeX = x2 - (x2 - x1)/2 + (slopeXRange * slope / 100);
					var slopeY = y1;
				}

				var slope = slopeX.toFixed(1) + ' ' + slopeY.toFixed(1);

				var point = new Circle({
					cx: slopeX,
					cy: slopeY,
					r: 4,
					fill: 'yellow',
				}, this.$svg);

				var d = `M${x1} ${y1} Q${slope} ${x2} ${y2}`;
				break;
			default :
				console.log('path type not supported');
		}
		return d;

	}

}