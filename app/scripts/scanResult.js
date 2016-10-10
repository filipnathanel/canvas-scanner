import * as utils from './utils/utils';

import Canvas from './canvas';

/**
 * A class to handle the canvas containng the result of scanning
 */

export default class ScanResult extends Canvas {

	constructor(scanResult, context){

		super(scanResult, context);

		this.init();
		this.initEvents();

	}

	init(){
		this.setDPI();
		this.downloadButton = utils.getEl('#download-image', this.context)
	}

	initEvents(){

		this.downloadButton.addEventListener('click', (e)  => {

			var image = this.trimResult();

			this.download(e.target, image);

		});

	}

	download(el, image){

		var blob = this.dataUrlToBlob(image),
			objUrl = URL.createObjectURL(blob);

		el.download = 'glitch_scanned.png';
		el.href = objUrl;

	}

	/**
	 * trims the canvas to return only painted pixels
	 * @return {text} Image in URL format
	 */
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
			trimWidth = bounds.right - bounds.left,
			trimmed = this.context.getImageData(bounds.left, bounds.top, trimWidth, trimHeight);

		var tempCanvas = document.createElement('canvas'),
			tempContext = tempCanvas.getContext('2d');

		tempCanvas.width = trimWidth;
		tempCanvas.height = trimHeight;
		tempContext.putImageData(trimmed, 0, 0);

		return tempCanvas.toDataURL();

	}

	/**
	 * This method allows to bypass the Network Error when trying to download
	 * a file set <a> element via a.href = canvas.toDataUrl()
	 * @param  {dataUrl} dataUrl
	 * @return {Blob} a Blob containing the data to Save
	 */
	dataUrlToBlob(dataUrl){
	    
	    var arr = dataUrl.split(','), 
	    	mime = arr[0].match(/:(.*?);/)[1],
	    	bstr = atob(arr[1]), 
	    	n = bstr.length, 
	    	u8arr = new Uint8Array(n);
	    
	    while(n--){
		        u8arr[n] = bstr.charCodeAt(n);
	    }

	    return new Blob([u8arr], {type:mime});

	}

}