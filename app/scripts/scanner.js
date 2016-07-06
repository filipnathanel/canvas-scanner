import * as utils from './utils/utils';

import FileInput from './fileInput';

export default class Scanner {

	constructor(scanner){
		
		this.$scanner = utils.getEl(scanner);
		this.fileInput = new FileInput('#img_upload');
		
		this.initEvents();

	}

	initEvents(){

	}

	activate(){

		console.log('scanner activated');

	}
}