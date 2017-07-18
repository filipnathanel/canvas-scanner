import EventQueue from './utils/eventQueue';
import * as utils from './utils/utils';

/**
 * Class handling <input> element behaviour
 */

export default class FileInput {

	constructor( inputEl ) {

		this.$el = utils.getEl( inputEl );
		this.onFileChanged = new EventQueue();
		this.onWrongFileType = new EventQueue();

		this.allowedFileTypes = [
			'image/jpeg',
			'image/png',
			'image/svg+xml'
		];

		this.initEvents();

	}

	initEvents() {

		this.$el.addEventListener( 'change', this.fileChangeHandler.bind( this ) );

	}

	/**
	 * handler for <input> file change
	 * @param  {Event} e an Event object containing a ref to the file(s) passed
	 * @return {undefined}
	 *
	 * @todo allow multiple file handling
	 */
	fileChangeHandler( e ) {

		const file = this.$el.files[0];

		if ( this.isFileAllowed( file ) ) {

			this.onFileChanged.run( { file } );

		} else {

			this.onWrongFileType.run( { type: this.getFileType( file ) } );

		}

	}

	getFileType( file ) {

		if ( file.type.length === 0 ) {

			const nameType = file.name.substr( file.name.lastIndexOf( '.' ) + 1 );
			return nameType;

		}

		return file.type;

	}

	isFileAllowed( file ) {

		for ( const allowedType of this.allowedFileTypes ) {

			const fileType = this.getFileType( file );
			const isTypeinAllowedArray = allowedType.indexOf( this.getFileType( file ) ) >= 0;

			if ( allowedType === fileType || isTypeinAllowedArray ) {

				return true;

			}

		}

		return false;

	}

}