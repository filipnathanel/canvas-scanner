import * as utils from './utils/utils';

export default class Scanner {

	constructor(scanner){
		
		this.$scanner = utils.getEl(scanner);
		this.context = this.$scanner.getContext('2d');
		
		this.file = {};

		this.initEvents();

	}

	initEvents(){
		this.$scanner.addEventListener('imageUpdate', (e) => {this.onImageUpdated(e)});
	}


	onImageUpdated(e){
		var file = e.detail.file;

		// this.$scanner.setAttribute('width', file);

		var fr = new FileReader();
		console.log(fr);

		fr.addEventListener('load', (e) => {
			console.log(e);
			var rawImage = e.target.result;
			var image = new Image();
			image.src = rawImage;
			// console.log(image);
			this.$scanner.width = image.width;
			this.$scanner.height = image.height;
			this.context.drawImage(image,0,0);
			// this.$scanner.toDataURL('image/png');
		});

		fr.readAsDataURL(file);

	}


	addFile(file){

		console.log(file);

		var addFileEvent = new CustomEvent('imageUpdate', {
			detail:file
		});

		this.$scanner.dispatchEvent(addFileEvent);

	}
}