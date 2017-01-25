import * as utils from './utils/utils';
import Globals from './globals';
import XYController from './xyController/xyController';

/**
 * A class for handling multiple instances of XYControllers
 */

export default class Automation {

	constructor(automation){

		this.$automation = utils.getEl(automation);

		// init controllers
		this.xController = new XYController('#x-controller', {
			invert: true
		});

		if (window.testowanko){
			this.xController.pathData.addPoint(0, 100, 'quadratic', 15, 'start');
			this.xController.pathData.addPoint(50, 20, 'quadratic', 0, 'start');
		}

		this.yController = new XYController('#y-controller');
		this.rotationController = new XYController('#rotation-controller');

		// let's store references to controllers in array for the sake of better access.
		this.controllers = [
			this.xController,
			this.yController,
			this.rotationController
		];

		this.disabledHeight = 50;
		this.activeController = null

		this.init();

	}

	init(){
		this.initEvents();
		this.layout();

		this.setActiveController();
	}

	initEvents(){

		this.controllers.forEach((controller, i) => {

			// set active controller on edit icon click
			utils.getEl('.control--enable', controller.$el).addEventListener('click', (e)=>{
				this.setActiveController(i);
			});

			// set active controller on automation area click
			controller.$el.addEventListener('click', (e) => {
				if (controller.$el.classList.contains(controller.cssClass + '--disabled')){
					this.setActiveController(i);
				}
			});

		});

	}

	layout(){

		var scanner = utils.getEl('.scanner');
		var maxHeight = Globals.viewport.height - scanner.clientHeight;
		var controllerMaxHeight = maxHeight - (this.controllers.length-1) * this.disabledHeight;

		// set initially active controller
		if ( !this.activeController ){
			this.activeController = 0;
		}

	}

	/**
	 * Sets active controller
	 * @param {int} i an int from range [0;int+];
	 */
	setActiveController(i){

		if (typeof i === 'number'){
			this.activeController = i;
		}

		this.controllers.forEach((controller, i) => {
			if (this.activeController === i){
				controller.$el.classList.add( controller.cssClass + '--active');
				controller.$el.classList.remove( controller.cssClass + '--disabled');
			}else{
				controller.$el.classList.add( controller.cssClass + '--disabled');
				controller.$el.classList.remove( controller.cssClass + '--active');
			}

			// let's allow the paint to take effect before redrawing
			setTimeout( ()=>{
				controller.pathData.redrawPoints();
				controller.pathData.redrawPaths();
			} );

		});
	}

	/**
	 * collective access point for all automations.
	 * @param  {float} percent value
	 * @return {object} returns an object with automation values for given percent
	 */
	getValueAtPercent(percent){

		return {
			x: this.xController.getValueAtPercent(percent),
			y: this.yController.getValueAtPercent(percent),
			rotation: this.rotationController.getValueAtPercent(percent)
		}

	}

}