import * as utils from './utils/utils';
import Globals from './globals';

export default class ScanArea {
	
	constructor(scanArea, context){

		this.canvas = utils.getEl(scanArea, context);
		this.context = this.canvas.getContext('2d');

		// this is for landscape 72dpi
		this.a4BaseWidth = 842;
		this.a4BaseHeight = 595;

		this.init();
		this.initEvents();
	}

	init(){

		// this.canvas.width = Globals.viewport.width;
		// this.canvas.height = Globals.viewport.height / 2 ;
		this.canvas.width = this.a4BaseWidth;
		this.canvas.height = this.a4BaseHeight

		// console.log(this.canvas.width);
	}

	initEvents(){

		Globals.onResize.add(() => { 
			console.log('scanArea onresize trigerred');
			// this.canvas.width = Globals.viewport.width;
		});

	}

	loadFile(file){
		var fr = new FileReader();

		fr.addEventListener('load', (e) => {
			var rawImage = e.target.result;
			var image = new Image();
			image.src = rawImage;
			
			this.image = image;

			// this.$scanner.width = image.width + image.width * 0.2;
			// this.$scanner.height = image.height + image.height * 0.2;
			this.context.drawImage(image, (this.canvas.width - image.width) / 2, (this.canvas.height - image.height) / 2);
			this.imageLoaded = true;

			// setTimeout( () => { this.moveImage() }, 1000);
		});

		fr.readAsDataURL(file);
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