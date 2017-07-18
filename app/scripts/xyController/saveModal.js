import Popup from '../popup/popup';
import * as utils from '../utils/utils';
import Globals from '../globals';

export default class saveModal {

	constructor(){

		this.$el = utils.getEl( '.save-popup' );

		this.init();
		this.initEvents();

	}

	init() {

		this.popup = new Popup( this.$el, {
			// 'trigger': '.control--save',
			afterOpen: () => {

				this.afterOpen();

			}
		} );

		this.$input = utils.getEl( 'input', this.$el );
		this.$enter = utils.getEl( '.enter', this.$el );

	}

	initEvents(){

		this.$enter.addEventListener( 'click', e => {

			e.preventDefault();
			this.onEnterClick();

		} );

	}

	afterOpen(){

		const enterListener = e => {

			if ( e.keyCode === 13 ) {

				this.submitData();

				document.removeEventListener( 'keypress', enterListener );

			}

		};

		this.$input.focus();

		document.addEventListener( 'keypress', enterListener );

	}

	onEnterClick() {

		this.submitData();

	}

	prepare( data ) {

		this.dataToSave = data.array.map( PathPoint => {

			return this.pathPointFilter( PathPoint );

		} );

		this.popup.openOverlay();
	}

	submitData() {

		let fileName = this.$input.value;
		fileName = fileName.replace(/ /g, '-');

		const now = new Date();
		const saveName = `${fileName}_${now.getFullYear()}_${now.getMonth() + 1}_${now.getDate()}_${now.getHours()}:${now.getMinutes()}`;

		Globals.automationStore.set(saveName, this.dataToSave);

		this.popup.closeOverlay();
	}

	pathPointFilter( PathPoint ) {

		const allowedProps = ['x','y','type','slope'];

		const PathPointFiltered = {};

		for ( let prop in PathPoint ){

			if ( PathPoint.hasOwnProperty( prop ) && allowedProps.indexOf( prop ) > -1 ) {

				PathPointFiltered[prop] = PathPoint[prop];

			}

		}

		return PathPointFiltered;

	}

}