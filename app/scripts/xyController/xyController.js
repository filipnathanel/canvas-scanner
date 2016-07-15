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


		this.points2 = new PathData();
		// this.chart = new Chart();
		/*
		The use
		this.points2.insert
		 */


		// this will instantiate points as SortedArray that sorts as supplied sorting function.
		this.points = utils.SortedArray.comparing( (item) => {return item.options.cx;}, []);
		this.paths = [];

		console.log(this.$svg);

		this.init();
		this.initEvents();

		console.log(this.points);

	}

	init(){

		this.addPoint(0,20);
		this.addPoint(40,100);
		this.addPoint(this.svgWidth, 40);

		this.connectPoints();

	}

	addPoint(x, y){

		var point = new Circle({
			cx: x,
			cy: y,
			r: 4,
			fill: 'red'
		}, this.$svg);

		this.points.insert(point);

		this.connectPoints();

		/*
		this.PathData.insert(new PathPoint(x,y));
		 */

	}

	connectPoints(){

		var len = this.points.array.length;
		var loopTo = len -1;

		if (len > 1){

			// this.points.array.forEach( (point) => {
			
			// do some shit for every point but the last one
			for (var i = 0; i < loopTo; i++) {

				var d = `M${this.points.array[i].options.cx} ${this.points.array[i].options.cy} L${this.points.array[i+1].options.cx} ${this.points.array[i+1].options.cy} Z`;

				var path = new Path({
					'd':d,
					'stroke':'blue',
					'stroke-width':'2'
				}, this.$svg);

				// this.paths.push(path);
				// console.log(path.el);
			}

			// // the last un
			// this.points.array[loopTo];

		}
	}

	getValueAtPercent( percent ){

		// simply calculate the x coordinate at given x percent
		var currentX = this.svgWidth * percent < this.svgWidth ? this.svgWidth * percent : this.svgWidth ;
		
		// var pth = this.paths[0].el;
		// console.log(currentX);
		// console.log(pth);
		// var currentWut =  pth.getPointAtLength(currentX) ;

		this.addPoint(currentWut.x, currentWut.y);
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
