export default class SampleImage {

	constructor() {

		return new Promise( resolve => {

			const testImage = new Image();

			testImage.onload = () => {

				resolve( testImage );

			};

			testImage.src = 'images/test_image.jpg';

		} );


		// var parts = [ 
		// 	utils.dataUrlToBlob( this.dataUrl() ),
		// ]
		// var file = new File(
		// 	parts,
		// 	'ryjek.png',
		// 	{			
		// 		lastModified : new Date(),
		// 		type: 'image/png'
		// 	}
		// )

		// return file;

	}

	onImageLoaded( e ) {

		console.log(e);

	}

	dataUrl() {

		return '';

	}
}

