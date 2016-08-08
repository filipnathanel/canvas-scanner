import * as utils from '../utils/utils';
import SVGUtils from '../utils/svgUtils';

import Globals from '../globals';

import Circle from './circle';
import Path from './path';
import PathData from './pathData';

import ContextMenu from '../contextMenu/contextMenu';


export default class XYController{

	constructor(controller, options){
		
		this.$wrap = utils.getEl(controller);
		this.$el = utils.getEl('.xy-controller', this.$wrap);
		this.$svg = utils.getEl('svg', this.$el);

		this.svgWidth = this.$svg.width.baseVal.value;
		this.svgHeight = this.$svg.height.baseVal.value;

		this.pathData = new PathData( this.$svg );
		this.pointContextMenu = new ContextMenu();

		this.init(options);
		this.initEvents();

		this.defaults = {
			range:[-50,50]
		};

	}

	init(options){

		this.options = utils.extend( this.defaults, options);

		// initialise the viewbox for scaling
		// this.$svg.setAttribute('width', this.svgWidth);
		// this.$svg.setAttribute('height', this.svgHeight);
		this.$svg.setAttribute('viewBox', '0 0 ' + this.svgWidth + ' ' + this.svgHeight);
		this.$svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
		// this.$svg.setAttribute('preserveAspectRatio', 'none');

		// add the automation points at the beginning and at the end of the control space
		this.addPoint(0,this.svgHeight/2);
		this.addPoint(this.svgWidth, this.svgHeight/2, 'linear');

	}

	refresh(){

		this.pathData.array.forEach( (point) => {
			this.pathData.remove(point);
		});

		this.addPoint(0,this.svgHeight/2);
		this.addPoint(this.svgWidth, this.svgHeight/2, 'linear');
		
	}

	addPoint(x, y, type = 'quadratic'){
		this.pathData.addPoint(x, y, type);
	}

	getValueAtPercent( percent ){

		// simply calculate the x coordinate at which we will be looking for automation value
		var svgX = this.svgWidth * percent < this.svgWidth ? this.svgWidth * percent : this.svgWidth ;
		// get the path corresponding for the given svgX value
		var currentPath = this.pathData.getPathAtX(svgX),
			currentPathIndex = this.pathData.data.search(currentPath),
			nextPathIndex = currentPathIndex + 1;

		// if currentPath isn't the last one
		if (this.pathData.data.array[nextPathIndex]){
			var xWidth = this.pathData.data.array[nextPathIndex].x - currentPath.x,
				relativeX = svgX - currentPath.x,
				xPercent = relativeX / xWidth;
		}else{
			var val = currentPath.y / this.svgHeight;
		}

		var $path = this.pathData.data.array[currentPathIndex].path;

		if ($path){
			var coords = $path.el.getPointAtLength($path.el.getTotalLength() * xPercent);
			var val = coords.y / this.svgHeight
		}

		if (this.options.invert === true) return 1 - val;
		return val;

	}


	initEvents(){
		this.$svg.addEventListener('mousemove', (e) => { this.onMouseMove(e); });
		this.$svg.addEventListener('click', (e) => { this.onLeftClick(e); });
		this.$svg.addEventListener('contextmenu', (e) => { this.onRightClick(e); });
	}

	onLeftClick(e){}

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
