import * as utils from './utils/utils';

export default class SampleImage {

	constructor(){

		var parts = [ 
			utils.dataUrlToBlob( this.dataUrl() ),
		]
		var file = new File(
			parts,
			'ryjek.png',
			{			
				lastModified : new Date(),
				type: 'image/png'
			}
		)

		return file;

	}

	dataUrl(){
		return '';
	}
}

