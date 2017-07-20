export default class SampleImage {

	constructor() {

		return new Promise( resolve => {

			const testImage = new Image();

			testImage.onload = () => {

				resolve( testImage );

			};

			testImage.src = 'images/test_image.jpg';

		} );

	}

}
