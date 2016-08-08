import * as utils from './utils/utils';
import Globals from './globals';

import ScanArea from './scanArea';
import ScanResult from './scanResult';

import Automation from './automation';
import XYController from './xyController/xyController';

export default class Scanner {

	constructor(scanner){

		this.DPI = 72;
		
		// wrap div
		this.$scanner = utils.getEl(scanner);
		this.scanArea = new ScanArea('#scan-area', this.$scanner);
		this.scanResult = new ScanResult('#scan-result', this.$scanner);

		this.$scanButton = utils.getEl('#start_scan');

		this.automation = new Automation('.automation');

		this.indicator = utils.getEl('.scan-indicator');
		
		this.imageLoaded = false;

		this.file = {};

		this.activate();

	}

	activate(){

		// set the default dpi value
		this.setDPI(this.DPI);
		this.initEvents();

		this.scanning = false;
	}

	// events initialisation
	initEvents(){

		this.$scanner.addEventListener('imageUpdate', (e) => {this.onImageUpdated(e)});
		this.$scanButton.addEventListener('click', (e) => {this.onScanClick(e)});

		Globals.onResize.add( () => { this.scanArea.redraw() } );
	}

	// onResize(){}

	onImageUpdated(e){

		var file = e.detail.file;

		if (file){

			this.scanArea.image = null;
			this.scanArea.context.clearRect(0, 0, this.scanArea.canvas.width, this.scanArea.canvas.height);

			this.loadFile(file).then( (image) => {

				this.rescaleScanAreas(image);

				this.scanArea.drawImage(image);
			});

		}


	}

	loadFile(file){
		var fr = new FileReader();

		return new Promise((resolve, reject) => {

			fr.readAsDataURL(file);
			
			fr.addEventListener('load', (e) => {

				var rawImage = e.target.result;
				var image = new Image();
				image.src = rawImage;

				resolve(image);

			});

		});
	}

	rescaleScanAreas(image){

		var a4BaseWidth = 842;
		var a4BaseHeight = 595;

		var scanWidth = image.width + image.width * 0.2;
		var scanHeight = image.height + image.height * 0.2;

		var widthDPI = Math.round( scanWidth / a4BaseWidth * 72);
		var heightDPI = Math.round( scanHeight / a4BaseHeight * 72);
		var DPI = widthDPI >= heightDPI ? widthDPI : heightDPI;

		// we need to handle scaling down as well
		if ( this.scanArea.canvas.width < image.width + image.width * 0.2 || this.scanArea.canvas.height < image.height + image.height * 0.2){
			this.setDPI( DPI );
		} else if ( this.scanArea.canvas.width > image.width + image.width * 0.3 || this.scanArea.canvas.height > image.height + image.height * 0.3 ){
			if ( DPI > 72 ){
				this.setDPI(DPI);
			}else{
				this.setDPI(this.DPI);
			}
		}

	}

	// scan trigger
	onScanClick(e){
		if( this.scanArea.imageLoaded === true && this.scanning === false ){
			this.scan();
		}else{
			console.log('no image present in the scanner');
		}

	}

	scan(){

		this.scanning = true;

		var self = this;

		var start = null;
		var duration = 1000;

		var currentStep = 0;
		var newStep = 0;

		function scanLoop(timestamp){

			if (!start) start = timestamp;
			var progress = ((timestamp - start) / duration);

			// calculate the next step
			newStep = progress * self.scanArea.canvas.width;

			// the length of the scan step;
			var stepsDiff = newStep - currentStep;

			if (currentStep > 0){
				var scanned = self.scanArea.context.getImageData(currentStep, 0, stepsDiff, self.scanArea.canvas.height );
				self.scanResult.context.putImageData( scanned, currentStep, 0, 0, 0, scanned.width, scanned.height );
			}

			// move the image
			var change = self.automation.getValueAtPercent(progress);

			self.scanArea.moveImage(change.x, change.y, change.rotation);

			// need to experiment with transform translate px val to see wheter it's better performant
			self.indicator.style.left = (progress * 50).toFixed(2) + '%';
			// increment the step
			currentStep = newStep;

			if ( progress < 1 ){
				window.requestAnimationFrame(scanLoop);
			}else{
				self.scanning = false;
			}

		}

		window.requestAnimationFrame(scanLoop);

		// one of the ways to approach it is to scan every pixel and the other to scan in batches.
		// everypixel approach would be time independent and reliant only on comp performance,
		// whereas the batch approach would need to scan 1 px fer animation Frame therefore would limit our speed to ~60px per second.
		// I wil first go with the 1 px approach as it seems more bulletproof.

	}

	setDPI( dpi ){
		this.scanArea.setDPI( dpi );
		this.scanResult.setDPI( dpi );
	}

	/**
	 * Interface method
	 * @param {File} file supplied by external input handler 	
	 */
	addFile(file){

		var addFileEvent = new CustomEvent('imageUpdate', {
			detail:file
		});

		this.$scanner.dispatchEvent(addFileEvent);

	}
}

