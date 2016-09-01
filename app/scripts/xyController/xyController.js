import * as utils from '../utils/utils';
import SVGUtils from '../utils/svgUtils';

import Globals from '../globals';

import Circle from './circle';
import Path from './path';
import PathData from './pathData';

export default class XYController{

	constructor(controller, options){
		
		this.cssClass = 'xy-controller';

		this.$wrap = utils.getEl(controller);
		this.$el = utils.getEl('.' + this.cssClass, this.$wrap);
		this.$svg = utils.getEl('.' + this.cssClass +'__area', this.$el);

		this.pathData = new PathData( this.$svg );

		this.init(options);
		this.initEvents();

	}

	get svgWidth(){ 
		var box = this.$svg.getBoundingClientRect();
		return box.right-box.left;
	}
	get svgHeight(){ 
		var box = this.$svg.getBoundingClientRect();
		return box.bottom-box.top;
	}

	init(options){

		this.options = utils.extend( this.defaults, options);
		// buttons
		this.$controls = utils.getEl('.' + this.cssClass + '__controls', this.$el);
		this.$refresh = utils.getEl('.control--refresh', this.$controls);
		this.$save = utils.getEl('.control--save', this.$controls);
		this.$load = utils.getEl('.control--load', this.$controls);

		// add the automation points at the beginning and at the end of the control space
		this.addPoint(0, 50);
		this.addPoint(100, 50, 'linear');

	}

	initEvents(){
		Globals.onResize.add( () => {this.onResize()}  );

		this.$refresh.addEventListener('click', (e)=>{
			this.refresh();
		});

		this.$save.addEventListener('click', (e) => {
			this.save();
		});

		this.$load.addEventListener('click', (e) => {
			console.log(Globals.automationStore);
		});

	}

	onLeftClick(e){}

	onResize(){
		this.pathData.redrawPoints();
		this.pathData.redrawPaths();
	}

	refresh(){

		var arrLen = this.pathData.data.array.length;

		// as the Path Data is self ordering after remobing it's items
		// we only have to remove first item.
		while( this.pathData.data.array.length > 0 ){
			this.pathData.removePoint(this.pathData.data.array[0]);
		}

		this.addPoint(0, 50);
		this.addPoint(100, 50, 'linear');
		
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
		var percent = percent < 1 ? Math.round( percent * 10000 ) / 100 : 100;

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

	save(){

		// var dateNow = new Date();
		// var saveName = dateNow.getMonth() + '_' + dateNow.getDay() + '_' + dateNow.getHours();

			// Globals.automationStore.set(saveName, this.pathData.data);
	}

	load(){

	}

}