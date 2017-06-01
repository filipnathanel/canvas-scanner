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

		this.spacebarHandler = this.spacebarHandler.bind(this);

	}

	addSpacebarListener(){
		document.body.addEventListener('keyup', this.spacebarHandler );
	}

	removeSpacebarListener(){
		console.log(this);
		document.body.removeEventListener('keyup',this.spacebarHandler);
	}

	spacebarHandler(e){
		console.log('spacebarHandler called');
	    if(e.keyCode == 32){
	        this.requestStop = true;
	    }
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
			this.loadFile(file).then( this.addImageToScanner.bind(this) );

		}

	}

	addImageToScanner (image){

		this.image = image;

		this.rescaleScanAreas(image);

		this.scanArea.drawImage(image);

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

	wtfScan(){

		var start = performance.now();
		var mainScan = this.scanArea.context.getImageData( 0, 0, this.scanArea.canvas.width, this.scanArea.canvas.height ) ;
		var pixels = mainScan.data;

		var xMax = mainScan.width;
		var yMax = mainScan.height;
		var lenn = pixels.length;

		var transformedPixels = [];

		// loop enough times to represent whole image
		for( var i = 0; i < xMax ; i++){

			// rownanie ogólne funkcji
			//  f(x) = ax + b
			// var xChange = xVal ? (this.canvas.width - this.image.width ) * xVal : (this.canvas.width - this.image.width) / 2 ,
			var progress = i / xMax ;

			// zlupuj row
			// for (var j = 0; j < lenn; j+= yMax){
			// 	// transformedPixels.push(pixels[j+i]);
			// 	transformedPixels[transformedPixels.length] = (pixels[j+i]);
			// }

			// console.log(progress)
			var change = this.automation.getValueAtPercent(progress);

			// var wartoscX = i * change.x;

			var angle = Math.round((-45 + 90 * change.rotation) * 100) / 100 ;
			// console.log('angle: ' + angle)
			var wspolczynnik = Math.tan(angle);

			console.log(wspolczynnik);


			// var rezultat = wspolczynnik * wartoscX;

		}
		// console.log(transformedPixels);

		var end = performance.now();
		var duration = end - start;

	}


	scan(){

		this.scanning = true;
		this.addSpacebarListener();
		this.$scanner.classList.add('scanner--active');

		let start = null;
		let scansPerFrame = 10;

		// 16.667ms is roughly the framelength
		let duration = (this.scanArea.canvas.width * 17) / scansPerFrame;
		let progress = 0;

		let currentStep = 0;
		let newStep = 0;

		const scanLoop = (timestamp) => {
			
			for (let i = 0; i < scansPerFrame; i++) {

				progress = currentStep / this.scanArea.canvas.width;

				if (currentStep > 0){
					// console.log(currentStep)
					let scanned = this.scanArea.context.getImageData(currentStep, 0, 1, this.scanArea.canvas.height );
					console.log(scanned.data[1000],scanned.data[1001],scanned.data[1002]);
					if ( window.testowanko ){
						this.scanResult.context.putImageData( scanned, currentStep, 0, 0, 0, scanned.width, scanned.height );
					} else{
						this.scanResult.context.putImageData( scanned, currentStep, 0, 0, 0, scanned.width, scanned.height );
					}
				}

				
				let change = this.automation.getValueAtPercent(progress);
				// console.log(change);
				this.scanArea.moveImage(change.x, change.y, change.rotation);

				currentStep++;
			}


			// need to experiment with transform translate px val to see wheter it's better performant
			this.indicator.style.left = (progress * 50).toFixed(2) + '%';
			// increment the step

			
			if( this.requestStop === true ){
				this.scanning = false;
				this.requestStop = false;
				this.removeSpacebarListener();
			} else if ( progress <= 1 ){
				window.requestAnimationFrame(scanLoop);
			}else{
				this.scanning = false;
				this.$scanner.classList.remove('scanner--active');
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

