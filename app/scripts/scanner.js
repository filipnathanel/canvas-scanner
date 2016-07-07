import * as utils from './utils/utils';

export default class Scanner {

	constructor(scanner){
		
		//scanner
		this.$scanner = utils.getEl(scanner);
		this.context = this.$scanner.getContext('2d');
		//scanned
		this.$scan = utils.getEl('#scan');
		this.scanContext = this.$scan.getContext('2d');
		this.$scanButton = utils.getEl('#start_scan');
		
		this.imageLoaded = false;

		this.file = {};

		this.initEvents();

	}

	initEvents(){

		this.$scanner.addEventListener('imageUpdate', (e) => {this.onImageUpdated(e)});
		this.$scanButton.addEventListener('click',(e) => {this.onScanClick(e)})
	}


	onImageUpdated(e){

		var file = e.detail.file;

		this.loadFileToScanner(file);

	}

	loadFileToScanner(file){
		var fr = new FileReader();

		fr.addEventListener('load', (e) => {
			var rawImage = e.target.result;
			var image = new Image();
			image.src = rawImage;
			this.$scanner.width = image.width;
			this.$scanner.height = image.height;
			this.context.drawImage(image,0,0);
			this.imageLoaded = true;
		});

		fr.readAsDataURL(file);
	}

	onScanClick(e){
		if(this.imageLoaded === true){
			this.scan();
		}else{
			console.log('no image present in the scanner');
		}

	}

	scan(){

		var start = null;
		var duration = 2000;
		
		var self = this; 
		
		function scanLoop(timestamp){

			if (!start) start = timestamp;
			var progress = timestamp - start;
			// console.log(progress);
			
			// console.log(progress/duration);
			var currentStep = (progress / duration) * self.$scanner.width;
			currentStep = currentStep > 0 ? currentStep : 1 ; 

			var scanned = self.context.getImageData(0,0, currentStep, self.$scanner.height);
			console.log(scanned);
			self.scanContext.putImageData(scanned,0,0);

			if ( progress < duration ){
				window.requestAnimationFrame(scanLoop);
			}

		}

		window.requestAnimationFrame(scanLoop);


	}


	addFile(file){

		var addFileEvent = new CustomEvent('imageUpdate', {
			detail:file
		});

		this.$scanner.dispatchEvent(addFileEvent);

	}
}