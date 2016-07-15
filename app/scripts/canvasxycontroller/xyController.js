import * as utils from '../utils/utils';
import CanvasUtils from '../utils/canvasUtils';

import Globals from '../globals';

import Point from './point';

export default class XYController{

	constructor(controller, context){
		this.$el = utils.getEl(controller, context);
		this.canvas = this.$el.querySelector('canvas');
		this.context = this.canvas.getContext('2d');

		this.canvas.width = this.$el.getBoundingClientRect().width;
		this.canvas.height = this.$el.getBoundingClientRect().height;

		this.points = [];

		this.initEvents();

		// this.state
	}

	initEvents(){

		this.canvas.addEventListener('mousemove', (e) => { this.onMouseMove(e); });
		this.canvas.addEventListener('click', (e) => { this.onLeftClick(e); });
		this.canvas.addEventListener('contextmenu', (e) => { this.onRightClick(e); });
	}

	onLeftClick(e){
		var mousePos = CanvasUtils.mousePos(e, this.canvas);

		var point = new Point(mousePos.x, mousePos.y, this.context);
	}

	onRightClick(e){
		e.preventDefault();
		var mousePos = CanvasUtils.mousePos(e, this.canvas);
	}

	onMouseMove(e){

		var mousePos = CanvasUtils.mousePos(e, this.canvas);

		switch(this.state){
			case 'dragging':
				console.log('dragging');
				break;
			default:

		}
	}

	addPoint(){

	}

	mousePos(e){

	}

	// static mouse(e){

	// 	console.log(e);

	// 	return {
	// 		x:1,
	// 		y:2
	// 	};
	// }


}