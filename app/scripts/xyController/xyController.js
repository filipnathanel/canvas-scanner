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

	init(options){

		this.options = utils.extend( this.defaults, options);
		// buttons
		this.$controls = utils.getEl('.' + this.cssClass + '__controls', this.$el);
		this.$refresh = utils.getEl('.control--refresh', this.$controls);
		this.$save = utils.getEl('.control--save', this.$controls);
		this.$load = utils.getEl('.control--load', this.$controls);

		// the starting points have their x Pos out of scale
		// so the user added point don't take their limiter behaviour
		this.pathData.addPoint(-0.01, 50, 'quadratic', 0, 'start');
		this.pathData.addPoint(100.01, 50, 'linear', 0, 'end');

	}

	initEvents(){
		Globals.onResize.add( () => {this.onResize()}  );

		this.$refresh.addEventListener('click', this.onRefreshClick.bind(this));

		this.$save.addEventListener('click', (e) => {
			this.onSaveClick();
		});

		this.$load.addEventListener('click', (e) => {
			this.onLoadClick();
		});

	}

	onLeftClick(e){}

	onResize(){
		this.pathData.redrawPoints();
		this.pathData.redrawPaths();
	}

	onRefreshClick(){

		this.pathData.reset();

		this.pathData.addPoint(-0.1, 50, 'quadratic', 0);
		this.pathData.addPoint(100.1, 50, 'linear', 0);
		
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

	onSaveClick(){
		Globals.saveModal.prepare( this.pathData.data );
	}

	onLoadClick(){
		// Open the load modal and pass the reference to current controller.
		Globals.loadModal.open( this );
	}

	loadPathData( pathData ){

		this.pathData.reset();

		utils.forEach(pathData, point => {
			this.pathData.addPoint(point.x, point.y, point.type, point.slope);
		});

		Globals.loadModal.close();

	}

}