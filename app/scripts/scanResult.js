import * as utils from './utils/utils';
import Globals from './globals';

export default class ScanResult{

	constructor(scanResult, context){

		this.canvas = utils.getEl(scanResult, context);
		this.context = this.canvas.getContext('2d');

		this.init();
		this.initEvents();
	}

	init(){
		this.canvas.width = Globals.viewport.width;
		this.canvas.height = Globals.viewport.height / 2 ;
	}

	initEvents(){

		Globals.onResize.add(() => { 
			console.log('scanResult onResize trigerred');
			this.canvas.width = Globals.viewport.width;
		});

	}

}