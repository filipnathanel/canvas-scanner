import * as utils from './utils/utils';
import Globals from './globals';
import XYController from './xyController/xyController';

export default class Automation {

	constructor(automation){

		this.$automation = utils.getEl(automation);

		this.xController = new XYController('#x-controller', {
			invert: true
		});
		this.yController = new XYController('#y-controller');
		this.rotationController = new XYController('#rotation-controller');

		this.controllers =[
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
			utils.getEl('.control--enable', controller.$el).addEventListener('click', (e)=>{
				this.setActiveController(i);
			});

		});

		Globals.onResize.add(() => {
			this.controllers.forEach((controller) => {
				// controller.pathData.redraw();
			})
		})
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

			// let's allow the paint to take effect 
			setTimeout( ()=>{
				controller.pathData.redrawPoints();
				controller.pathData.redrawPaths();
			} )

		});
	}

	getValueAtPercent(percent){

		return {
			x: this.xController.getValueAtPercent(percent),
			y: this.yController.getValueAtPercent(percent),
			rotation: this.rotationController.getValueAtPercent(percent)
		}

	}

}