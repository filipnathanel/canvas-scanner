import * as utils from './utils/utils';
import Globals from './globals';

import Canvas from './canvas';

export default class ScanArea extends Canvas {
	
	constructor(scanArea, context){

		super(scanArea, context);

		this.init();
		this.initEvents();
		
	}

	init(){

		this.setDPI();

	}

	initEvents(){

		Globals.onResize.add(() => { 
			console.log('scanArea onresize trigerred');
			// this.canvas.width = Globals.viewport.width;
		});

		// window.czoo = this.setDpi;
		

	}

	drawImage(image){

		this.image = image;

		this.context.drawImage(image, (this.canvas.width - image.width) / 2, (this.canvas.height - image.height) / 2);
		this.imageLoaded = true;

	}

	redraw(){
		if (this.image){
			this.context.drawImage(this.image, (this.canvas.width - this.image.width) / 2, (this.canvas.height - this.image.height) / 2);
		}
	}

	clear(){
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
	
	moveImage(xVal){
		if (xVal){
			this.clear();
			this.context.drawImage( this.image, (this.canvas.width - this.image.width ) * xVal, (this.canvas.height - this.image.height) / 2 );
		}
	}


}

/**
 
scanArea.canvas
scanArea.context

 
 */