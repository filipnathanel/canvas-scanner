import * as utils from './utils/utils';
import Globals from './globals';

import ScanArea from './scanArea';
import ScanResult from './scanResult';

import XYController from './xyController/xyController';

export default class Scanner {

	constructor(scanner){
		
		// wrap div
		this.$scanner = utils.getEl(scanner);
		this.scanArea = new ScanArea('#scan-area', this.$scanner);
		this.scanResult = new ScanResult('#scan-result', this.$scanner);

		this.$scanButton = utils.getEl('#start_scan');

		this.xController = new XYController('#x-controller');
		// console.log(this.xController);
		
		this.imageLoaded = false;

		this.file = {};

		this.activate();

	}

	activate(){
		this.initEvents();
	}

	// events initialisation
	initEvents(){

		this.$scanner.addEventListener('imageUpdate', (e) => {this.onImageUpdated(e)});
		this.$scanButton.addEventListener('click', (e) => {this.onScanClick(e)});

		Globals.onResize.add( () => { this.scanArea.redraw() } );
	}

	onImageUpdated(e){

		this.scanArea.image = null;
		this.scanArea.context.clearRect(0, 0, this.scanArea.canvas.width, this.scanArea.canvas.height);

		var file = e.detail.file;
		this.scanArea.loadFile(file);
	}

	// scan trigger
	onScanClick(e){
		if( this.scanArea.imageLoaded === true ){
			this.scan();
		}else{
			console.log('no image present in the scanner');
		}

	}

	scan(){

		var self = this;

		var start = null;
		var duration = 10000;

		var currentStep = 0;
		var newStep = 0;

		function scanLoop(timestamp){

			if (!start) start = timestamp;
			var progress = ((timestamp - start) / duration);

			var xVal = self.xController.getValueAtPercent(progress);

			// I DUNNO WHY DIVIDE BY 2 BUT IT SEEMS TO WORK CORRECTLY :/
			
			newStep = progress/2 * self.scanArea.canvas.width;
			console.log('scanPointStart: ' + currentStep);
			console.log('scanPointEnd: ' + newStep);
			// console.log(currentStep);

			var stepsDiff = newStep - currentStep;
			// console.log('stepsDiff: ' + stepsDiff );
			if (currentStep > 20){
				var scanned = self.scanArea.context.getImageData(currentStep, 0, newStep, self.scanArea.canvas.height);
				self.scanResult.context.putImageData(scanned, currentStep, 0);
			}

			console.log(xVal);
			self.scanArea.moveImage(xVal);

			currentStep = newStep;

			if ( progress < 1 ){
				window.requestAnimationFrame(scanLoop);
			} else{
				alert('finished');
			}

		}

		window.requestAnimationFrame(scanLoop);
		// 
		// one of the ways to approach it is to scan every pixel and the other to scan in batches.
		// everypixel approach would be time independent and reliant only on comp performance,
		// whereas the batch approach would need to scan 1 px fer animation Frame therefore would limit our speed to ~60px per second.
		// I wil first go with the 1 px approach as it seems more bulletproof.

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

