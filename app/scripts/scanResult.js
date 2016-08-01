import * as utils from './utils/utils';
import Globals from './globals';

import Canvas from './canvas';

export default class ScanResult extends Canvas {

	constructor(scanResult, context){

		super(scanResult, context);

		// this.context = context;

		this.init();
		this.initEvents();
	}

	init(){

		this.setDPI();
		this.downloadButton = utils.getEl('#download', this.context)
		console.log(this.downloadButton);
		// this.canvas.width = Globals.viewport.width;
		// this.canvas.height = Globals.viewport.height / 2 ;
	}

	initEvents(){

		Globals.onResize.add(() => { 
			console.log('scanResult onResize trigerred');
			// this.canvas.width = Globals.viewport.width;
		});

		this.downloadButton.addEventListener('click', (e)  =>{
			
			this.trimResult().then( (image) => {

				this.download(e.target, image);
			
			});

		});

	}

	download(el, image){
		el.href = image;
		el.download = 'scanned';
	}

	// as per https://gist.github.com/remy/784508
	trimResult(){

		var imgData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height),
			dataLen = imgData.data.length,
			i,
			x,
			y;

		var bounds = {
			top:null,
			left:null,
			right:null,
			bottom:null
		}

		var start = new Date().getTime();

		for ( i = 0; i < dataLen; i+=4) {
			if (imgData.data[i+3] !== 0) {
		      x = (i / 4) % this.canvas.width;
		      y = ~~((i / 4) / this.canvas.width);
		  
		      if (bounds.top === null) {
		        bounds.top = y;
		      }
		      
		      if (bounds.left === null) {
		        bounds.left = x; 
		      } else if (x < bounds.left) {
		        bounds.left = x;
		      }
		      
		      if (bounds.right === null) {
		        bounds.right = x; 
		      } else if (bounds.right < x) {
		        bounds.right = x;
		      }
		      
		      if (bounds.bottom === null) {
		        bounds.bottom = y;
		      } else if (bounds.bottom < y) {
		        bounds.bottom = y;
		      }
		    }
		}

		var trimHeight = bounds.bottom - bounds.top,
			trimWidth = bounds.right - bounds.left;

		console.log(trimWidth + ' width');
		console.log(trimHeight + ' height');

		var end = new Date().getTime();
		var time = end - start;
		console.log('execution Time: ' + time);

		return new Promise((resolve, reject) => {


		});


	}

}