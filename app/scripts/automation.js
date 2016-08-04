import * as utils from './utils/utils';
import XYController from './xyController/xyController';

export default class Automation {

	constructor(automation){

		this.$automation = utils.getEl(automation);

		this.xController = new XYController('#x-controller');
		this.yController = new XYController('#y-controller');
		this.rotationController = new XYController('#rotation-controller');

	}

	layout(){

	}

	getValueAtPercent(percent){

		return {
			x: this.xController.getValueAtPercent(percent),
			y: this.yController.getValueAtPercent(percent),
			rotation: this.rotationController.getValueAtPercent(percent)
		}

	}

}