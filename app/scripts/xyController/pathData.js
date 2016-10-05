import * as utils from '../utils/utils';
import SVGUtils from '../utils/svgUtils';
import Circle from './circle';
import Path from './path';
import PathPoint from './pathPoint'

function spawnSortedArray(){
	return new utils.SortedArray([], function(a,b){
    	if (a.x === b.x) {
        	if (a.y === b.y){
        		return 0;
        	}else{
        		return a.y < b.y ? -1 : 1;
        	}
        }
        return a.x < b.x ? -1 : 1;
	});
}

export default class PathData  {

	constructor(svg){

		this.$svg = svg;

		this.data = spawnSortedArray();

		this.initEvents();

	}

	initEvents(){
		this.$svg.addEventListener('contextmenu', (e) => { this.onAreaRightClick(e); });
	}

	/**
	 * Add an automation point to the controller
	 * @param {float} x a percent of the x axis at which we are adding the point
	 * @param {float} y a percent of the y axis at which we are adding the point
	 */
	addPoint(x, y, type = 'linear', slope = 0){

		var point = new PathPoint(x, y, type, slope);

		point.render(this.$svg);

		point.on('update', this.updatePointHandler.bind(this));
		point.on('remove', this.removePointHandler.bind(this));

		this.data.insert(point);

		this.redrawPaths();

	}

	updatePointHandler(data){

		let point = data.point,
			circle = data.circle,
			xPos = data.xPos,
			yPos = data.yPos,
			pointLocation = this.data.search(point);

		this.data.remove(point);

		if ( pointLocation != 0 && pointLocation < this.data.array.length){
			circle.setAttribute('cx', xPos);
			point.x = SVGUtils.absWToRel(data.xPos, this.$svg);
		}

		circle.setAttribute('cy', yPos);
		point.y = SVGUtils.absHToRel(data.yPos, this.$svg);

		this.data.insert(point);

		this.redrawPaths();
	}

	removePointHandler(data){

		let point = data.point;

		this.data.remove(point);

		if (point.path){
			point.path.el.remove();
		}
		if (point.slopeControl){
			point.slopeControl.el.remove();
		}

		this.redrawPaths();
		
	}

	onAreaRightClick(e){
		
		e.preventDefault();

		let mousePos = SVGUtils.mousePos(e, this.$svg),
			relX = SVGUtils.absWToRel(mousePos.x, this.$svg),
			relY = SVGUtils.absHToRel(mousePos.y, this.$svg);

		this.addPoint( relX, relY, 'quadratic');
		
	}

	getPathAtPercent(x){

		var dataLen = this.data.array.length;

		for (var i = 0; i < dataLen; i++) {

			if( this.data.array[i+1] ){
				if ( x >= this.data.array[i].x && x < this.data.array[i+1].x ){
					if ( this.data.array[i].x === this.data.array[i+1].x ) {
						return this.data.array[i+1];
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

				var d = this.createPath( this.data.array[i], this.data.array[i+1] );

				var path = new Path({
					'd':d,
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

	/**
	 * creates a svg path between points
	 * @param  {point} pathFrom  a point the Path will be starting from
	 * @param  {point} pathTo   a point the Path will finish at
	 * @return {string}          a string value for the SVG path d attribute
	 */
	createPath(pathFrom, pathTo){

		var type = pathFrom.type,
			x1 = SVGUtils.relWToAbs(pathFrom.x, this.$svg),
			y1 = SVGUtils.relHToAbs(pathFrom.y, this.$svg),
			x2 = SVGUtils.relWToAbs(pathTo.x, this.$svg),
			y2 = SVGUtils.relHToAbs(pathTo.y, this.$svg),
			slope = pathFrom.slope;

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

				var slopeStr = slopeX.toFixed(1) + ' ' + slopeY.toFixed(1);

				var d = `M${x1} ${y1} Q${slopeStr} ${x2} ${y2}`;
				break;
			default :
				console.log('path type not supported');
		}

		return d;

	}

	addControls(){

		this.removeControls();

		var len = this.data.array.length;
		var loopTo = len -1;

		if (len > 1){

			for (let iteration = 0; iteration < loopTo; iteration++) {

				if (this.data.array[iteration].type === 'quadratic'){

					var currentPath = this.data.array[iteration].path;

					var slopeControlPos = currentPath.el.getPointAtLength( currentPath.el.getTotalLength() / 2 );
					var slopeControl = new Circle({
						cx: slopeControlPos.x.toFixed(2),
						cy: slopeControlPos.y.toFixed(2),
						r: 4,
					}, this.$svg);

					slopeControl.el.classList.add('slope-controller');
					slopeControl.el.addEventListener('mousedown', (e)=>{
						this.onSlopeControlLeftClick(e, this.data.array[iteration] );
					});
					slopeControl.el.addEventListener('contextmenu', (e)=>{
						e.preventDefault();
						e.stopPropagation();
						this.data.array[iteration].slope = 0;
						this.redrawPaths();
					});

					this.data.array[iteration].slopeControl = slopeControl;

				}
			}
		}
	}

	removeControls(){
		this.data.array.forEach( (item) => {

			if (item.slopeControl){
				item.slopeControl.el.remove();
				item.slopeControl = undefined;
			}

		});
	}

	onSlopeControlLeftClick(e, point){

			var self = this,
				selectedSlopeControl = e.target,
				clickPos = SVGUtils.mousePos(e, this.$svg),
				posDiff = { 
					x: selectedSlopeControl.getAttribute('cx') - clickPos.x,
					y: selectedSlopeControl.getAttribute('cy') - clickPos.y
				},
				mouseCache = clickPos.y + posDiff.y;

			function dragHandler(e) {

				var movePos = SVGUtils.mousePos(e, self.$svg),
					xPos = movePos.x + posDiff.x,
					yPos = movePos.y + posDiff.y;

					var moveDiff = mouseCache - yPos;
					if (moveDiff > 0){
						increaseSlope(moveDiff);
					}else if (moveDiff < 0){
						decreaseSlope(moveDiff);
					} else{
						// do nothing
					}
				mouseCache = yPos;

				self.redrawPaths();

			}

			function onMouseUp(){
				self.$svg.removeEventListener('mousemove', dragHandler);
				document.removeEventListener('mouseup', onMouseUp);
			}

			function increaseSlope(diff){
				if (point.slope + diff < -50){
					point.slope = -50;
				}else{
					point.slope = point.slope - diff;
				}
			}
			
			function decreaseSlope(diff){
				if (point.slope + diff > 50){
					point.slope = 50
				}else{
					point.slope = point.slope - diff;
				}
			}

			// attach drag handler
			this.$svg.addEventListener('mousemove', dragHandler);
			// listen for the drag end
			document.addEventListener('mouseup', onMouseUp);

	}


	redrawPaths(){
		this.addPaths();
		this.addControls();
	}

	redrawPoints(){

		this.data.array.forEach( (point) => {

			point.circle.el.remove();
			point.render(this.$svg);

		});
	}

	reset(){

		// as the Path Data is self ordering after remobing it's items
		// we only have to remove first item.
		while( this.data.array.length > 0 ){
			this.data.array[0].removeCircle();
		}

		this.data = spawnSortedArray();

	}

}