import * as utils from '../utils/utils';
import SVGUtils from '../utils/svgUtils';

import Globals from '../globals';

import Circle from './circle';
import Path from './path';
import PathData from './pathData';


export default class XYController{

	constructor(controller){
		
		this.$wrap = utils.getEl(controller);
		this.$el = utils.getEl('.xy-controller', this.$wrap);
		this.$svg = utils.getEl('svg', this.$el);

		this.svgWidth = this.$svg.width.baseVal.value;
		this.svgHeight = this.$svg.height.baseVal.value;

		this.pathData = new PathData( this.$svg );

		// this will instantiate points as SortedArray that sorts as supplied sorting function.
		this.points = utils.SortedArray.comparing( (item) => {return item.options.cx;}, []);
		this.paths = [];

		this.init();
		this.initEvents();

	}

	init(){

		this.addPoint(0,this.svgHeight/2);
		// this.addPoint(40,100);
		 
		// test if the x val of Coord is equal
		this.addPoint(40, this.svgHeight/4);
		this.addPoint(40, this.svgHeight/3);
		 
		this.addPoint(this.svgWidth, this.svgHeight/2);

		// this.connectPoints();

	}

	addPoint(x, y){
		this.pathData.addPoint(x, y);
		// this.connectPoints();
	}

	connectPoints(){

		var len = this.pathData.data.array.length;
		var loopTo = len -1;

		if (len > 1){
			
			// do some shit for every point but the last one
			for (var i = 0; i < loopTo; i++) {

				var d = `M${this.pathData.data.array[i].x} ${this.pathData.data.array[i].y} L${this.pathData.data.array[i+1].x} ${this.pathData.data.array[i+1].y} Z`;

				var path = new Path({
					'd':d,
					'stroke':'blue',
					'stroke-width':'2'
				}, this.$svg);

			}
		}
		
	}

	getValueAtPercent( percent ){

		// simply calculate the x coordinate at which we will be looking for automation value
		var svgX = this.svgWidth * percent < this.svgWidth ? this.svgWidth * percent : this.svgWidth ;
		// get the path that is present and controlling for given svgX value
		var currentPath = this.pathData.getPathAtX(svgX),
			currentPathIndex = this.pathData.data.search(currentPath),
			nextPathIndex = currentPathIndex + 1;

		// if currentPath isn't the last one
		if (this.pathData.data.array[nextPathIndex]){
			var xWidth = this.pathData.data.array[nextPathIndex].x - currentPath.x;

			// get x value starting from the start of the current path
			var relativeX = svgX - currentPath.x,
			// get progress percent for current path
				xPercent = relativeX / xWidth;
		}

		var paath = this.pathData.data.array[currentPathIndex].path;
		if (paath){
			// we divide it by two because getTotalLength returns double for single segment paths
			var coords = paath.el.getPointAtLength(paath.el.getTotalLength() / 2 * xPercent);
			
			// just indicate the current progress
			// disable after dev
			// var point = new Circle({
			// 	cx: coords.x,
			// 	cy: coords.y,
			// 	r: 2,
			// 	fill: 'yellow'
			// }, this.$svg);

			return coords.y / this.svgHeight;
		}

	}


	initEvents(){

		this.$svg.addEventListener('mousemove', (e) => { this.onMouseMove(e); });
		this.$svg.addEventListener('click', (e) => { this.onLeftClick(e); });
		this.$svg.addEventListener('contextmenu', (e) => { this.onRightClick(e); });
	}

	onLeftClick(e){
		var mousePos = SVGUtils.mousePos(e, this.$svg);

	}

	onRightClick(e){
		e.preventDefault();
		console.log('czo');
		var mousePos = SVGUtils.mousePos(e, this.$svg);
		this.addPoint(mousePos.x, mousePos.y);

	}

	onMouseMove(e){

		var mousePos = SVGUtils.mousePos(e, this.$svg);

		switch(this.state){
			case 'dragging':
				console.log('dragging');
				break;
			default:

		}
	}


}
