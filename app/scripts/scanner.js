import * as utils from './utils/utils';
import Globals from './globals';

import ScanArea from './scanArea';
import ScanResult from './scanResult';

import Automation from './automation';
import XYController from './xyController/xyController';

/**
 * This is the main Scanner class 
 * it initalises it's dependencies and contains the actual scan algorithm
 */
export default class Scanner {

	/**
	 * @param  {string} scanner a css type selector for the scanner EL
	 * @return {undefined}
	 */
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

		this.$scanner.addEventListener('imageUpdate', (e) => {this.imageUpdateHandler(e)});
		this.$scanButton.addEventListener('click', (e) => {this.scanClickHandler(e)});
		Globals.onResize.add( () => { this.scanArea.redraw() } );

	}

	/**
	 * a function that handles the imageUpdated Event
	 * the imageUpdated Event is a Custom Event triggered
	 * when a new Image is loaded into a scanner
	 * @param  {Event} e CustomEvent with a File passed in Event Details
	 * @return {undefined}
	 */
	imageUpdateHandler(e){

		let file = e.detail.file;

		if (file){

			// remove any previous images from Scanner Object
			this.scanArea.image = null;
			// clean the ScanArea canvas from remainders of any previous operations
			this.scanArea.context.clearRect(0, 0, this.scanArea.canvas.width, this.scanArea.canvas.height);

			// Asynchonously transform the File into Image
			this.loadFile(file).then( (image) => {

				this.image = image;

				this.rescaleScanAreas(image);

				this.scanArea.drawImage(image);
			});

		}

	}

	/**
	 * makes the file set on the Input Element available to browser context
	 * @param  {File} file receives any File object that could be taken from an input element
	 * @return {Promise} returns a promise that resolves to an Image Object
	 */
	
	// TODO: could be separated to a general fileReader that returns more file types than just an Image
	
	loadFile(file){

		let fr = new FileReader();

		return new Promise((resolve, reject) => {

			fr.readAsDataURL(file);
			
			fr.addEventListener('load', (e) => {

				let rawImage = e.target.result;
				let image = new Image();

				image.addEventListener('load',() =>{
					resolve(image);
				})

				image.src = rawImage;

			});

		});
	}

	rescaleScanAreas(image){

		let a4BaseWidth = 842;
		let a4BaseHeight = 595;

		let scanWidth = image.width + image.width * 0.2;
		let scanHeight = image.height + image.height * 0.2;

		let widthDPI = Math.round( scanWidth / a4BaseWidth * 72);
		let heightDPI = Math.round( scanHeight / a4BaseHeight * 72);
		let DPI = widthDPI >= heightDPI ? widthDPI : heightDPI;

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
	scanClickHandler(e){
		if( this.scanArea.imageLoaded === true && this.scanning === false ){
			// this.wtfScan();
			this.scan();
		}else{
			console.log('no image present in the scanner');
		}

	}

	scan(){

		this.scanning = true;
		this.$scanner.classList.add('scanner--active');

		let self = this;
		let start = null;
		let scansPerFrame = 3;

		// 16.667ms is roughly the framelength
		let duration = (self.scanArea.canvas.width * 17) / scansPerFrame;
		let progress = 0;

		let currentStep = 0;
		let newStep = 0;

		function scanLoop(timestamp){
			
			for (let i = 0; i < scansPerFrame; i++) {

				progress = currentStep / self.scanArea.canvas.width;

				if (currentStep > 0){
					let scanned = self.scanArea.context.getImageData(currentStep, 0, 1, self.scanArea.canvas.height );
					self.scanResult.context.putImageData( scanned, currentStep, 0, 0, 0, scanned.width, scanned.height );
				}

				let change = self.automation.getValueAtPercent(progress);
				self.scanArea.moveImage(change.x, change.y, change.rotation);

				currentStep++;
			}


			// need to experiment with transform translate px val to see wheter it's better performant
			self.indicator.style.left = (progress * 50).toFixed(2) + '%';
			// increment the step

			if ( progress <= 1 ){
				window.requestAnimationFrame(scanLoop);
			}else{
				self.scanning = false;
				self.$scanner.classList.remove('scanner--active');
			}

		}

		window.requestAnimationFrame(scanLoop);

		// one of the ways to approach it is to scan every pixel and the other to scan in batches.
		// everypixel approach would be time independent and reliant only on comp performance,
		// whereas the batch approach would need to scan 1 px fer animation Frame therefore would limit our speed to ~60px per second.
		// I wil first go with the 1 px approach as it seems more bulletproof.

	}

	setDPI( dpi ){

		this.DPI = dpi;

		this.scanArea.setDPI( dpi );
		this.scanResult.setDPI( dpi );
	}

	/**
	 * Interface method
	 * @param {File} file supplied by external input handler 	
	 */
	addFile(file){

		let addFileEvent = new CustomEvent('imageUpdate', {
			detail:file
		});

		this.$scanner.dispatchEvent(addFileEvent);

	}
}

