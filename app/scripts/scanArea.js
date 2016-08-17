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
			// console.log('scanArea onresize trigerred');
		});

	}

	drawImage(image){

		this.image = image;

		console.log({image:image})

		this.context.drawImage(this.image, (this.canvas.width - image.width) / 2, (this.canvas.height - image.height) / 2);
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
	
	moveImage(xVal, yVal, rotation){

		this.clear();

		var xChange = xVal ? (this.canvas.width - this.image.width ) * xVal : (this.canvas.width - this.image.width) / 2 ,
			yChange = yVal ? (this.canvas.height - this.image.height ) * yVal : (this.canvas.height - this.image.height) / 2;

		if(rotation){

			this.context.save();
			var angle = -45 + 90 * rotation,
				toRadians =  Math.PI/180;

			this.context.translate( (this.canvas.width)/2 + xChange - (this.canvas.width - this.image.width )/2, (this.canvas.height)/2 + yChange - (this.canvas.height - this.image.height )/2 );
			this.context.rotate(angle * toRadians);

			this.context.drawImage( this.image, -(this.image.width/2) , -(this.image.height/2) );

			this.context.restore();

		}else{
			this.context.drawImage( this.image, xChange , yChange);
		}



	}


}

/**
 
scanArea.canvas
scanArea.context

 
 */