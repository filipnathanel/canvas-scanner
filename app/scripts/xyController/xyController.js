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

		this.pathData = new PathData( this.$svg );
		this.pointContextMenu = new ContextMenu();

		this.init(options);
		this.initEvents();

	}

	get svgWidth(){ return this.$svg.width.baseVal.value ;}
	get svgHeight(){ return this.$svg.height.baseVal.value ;}

	init(options){

		this.options = utils.extend( this.defaults, options);

		// initialise the viewbox for scaling
		// this.$svg.setAttribute('width', this.svgWidth);
		// this.$svg.setAttribute('height', this.svgHeight);
		// this.$svg.setAttribute('viewBox', '0 0 ' + this.svgWidth + ' ' + this.svgHeight);
		// this.$svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
		// this.$svg.setAttribute('preserveAspectRatio', 'none');

		// add the automation points at the beginning and at the end of the control space
		this.addPoint(0, 50);
		this.addPoint(100, 50, 'linear');

	}

	initEvents(){
		// this.$svg.addEventListener('click', (e) => { this.onLeftClick(e); });
		// this.$svg.addEventListener('contextmenu', (e) => { this.onRightClick(e); });

		Globals.onResize.add( () => {this.onResize()}  );
	}

	onLeftClick(e){}

	onResize(){
		this.pathData.redrawPoints();
		this.pathData.redrawPaths();
	}

	refresh(){

		this.pathData.array.forEach( (point) => {
			this.pathData.remove(point);
		});

		this.addPoint(0, 50, 'quadratic');
		this.addPoint(100, 50);
		
	}

	/**
	 * short interface for PathData 
	 * @param {int} x    	x pos expressed in percent
	 * @param {int} y    	y pos expiressd in percent
	 * @param {string} type connection type
	 */
	addPoint(x, y, type = 'quadratic'){
		this.pathData.addPoint(x, y, type);
	}

	getValueAtPercent( percent ){

		// simply calculate the x coordinate at which we will be looking for automation value
		var percent = percent < 1 ? percent * 100 : 100;

		// get the path corresponding for the given svgX value
		var currentPath = this.pathData.getPathAtPercent(percent),
			currentPathIndex = this.pathData.data.search(currentPath),
			nextPathIndex = currentPathIndex + 1;

		// if currentPath isn't the last one
		if (this.pathData.data.array[nextPathIndex]){
			var xWidth = this.pathData.data.array[nextPathIndex].x - currentPath.x,
				relativeX = percent - currentPath.x,
				xPercent = relativeX / xWidth;
		}else{
			var val = currentPath.y/100;
		}

		var $path = this.pathData.data.array[currentPathIndex].path;

		if ($path){
			var coords = $path.el.getPointAtLength($path.el.getTotalLength() * xPercent);
			var val = coords.y / this.svgHeight;
		}

		if (this.options.invert === true) return 1 - val;
		return val;

	}

}
