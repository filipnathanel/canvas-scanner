import * as utils from './utils/utils';

import Canvas from './canvas';

/**
 * A class to handle the canvas containng the result of scanning
 */

export default class ScanResult extends Canvas {

	constructor( scanResult, context ) {

		super( scanResult, context );

		this.init();
		this.initEvents();

	}

	init() {

		this.setDPI();
		this.downloadButton = utils.getEl( '#download-image', this.context );

	}

	initEvents() {

		this.downloadButton.addEventListener( 'click', e => {

			const image = this.trimResult();

			ScanResult.download( e.target, image );

		} );

	}

	static download( el, image ) {

		const blob = utils.dataUrlToBlob( image );
		const objUrl = URL.createObjectURL( blob );

		el.download = 'glitch_scanned.png';
		el.href = objUrl;

	}

	/**
	 * trims the canvas to return only painted pixels
	 * @return {text} Image in URL format
	 */
	// as per https://gist.github.com/remy/784508
	trimResult() {

		const imgData = this.context.getImageData( 0, 0, this.canvas.width, this.canvas.height );
		const dataLen = imgData.data.length;

		let i;
		let x;
		let y;

		const bounds = {
			top: null,
			left: null,
			right: null,
			bottom: null
		};

		for ( i = 0; i < dataLen; i += 4 ) {

			if ( imgData.data[i + 3] !== 0 ) {

				x = ( i / 4 ) % this.canvas.width;
				y = ~~( ( i / 4 ) / this.canvas.width );

				if ( bounds.top === null ) {

					bounds.top = y;

				}

				if ( bounds.left === null ) {

					bounds.left = x;

				} else if ( x < bounds.left ) {

					bounds.left = x;

				}

				if ( bounds.right === null ) {

					bounds.right = x;

				} else if ( bounds.right < x ) {

					bounds.right = x;

				}

				if ( bounds.bottom === null ) {

					bounds.bottom = y;

				} else if ( bounds.bottom < y ) {

					bounds.bottom = y;

				}

			}

		}

		const trimHeight = bounds.bottom - bounds.top;
		const trimWidth = bounds.right - bounds.left;
		const trimmed = this.context.getImageData( bounds.left, bounds.top, trimWidth, trimHeight );

		const tempCanvas = document.createElement( 'canvas' );
		const tempContext = tempCanvas.getContext( '2d' );

		tempCanvas.width = trimWidth;
		tempCanvas.height = trimHeight;
		tempContext.putImageData( trimmed, 0, 0 );

		return tempCanvas.toDataURL();

	}

}
