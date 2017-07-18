import Popup from '../popup/popup';
import * as utils from '../utils/utils';
import Globals from '../globals';
import PopupItem from './PopupItem';

export default class loadModal {

	constructor() {

		this.$el = utils.getEl( '.load-popup' );

		this.init();

	}

	init() {

		this.popup = new Popup( this.$el, {

			// 'trigger': '.control--save',
			afterOpen: this.afterOpen.bind( this )

		} );

		this.$renderArea = utils.getEl( '.render-area', this.$el );

	}

	/**
	 * opens the modal and sets the xyController into which we will be lading data
	 * @param  {object} xyController an instance of XYController
	 * @return void/undefined
	 */
	open( xyController ) {

		this.renderStoreItems( xyController );
		this.popup.openOverlay();

	}

	close(){

		this.popup.closeOverlay();

	}

	renderStoreItems( xyController ) {

		this.popupItems = [];
		// refresh the renderArea
		this.$renderArea.innerHTML = '';

		const storeItems = Globals.automationStore.getAll();

		// construct popupItems from storeItems
		for( let prop in storeItems ) {

			const storeItem = storeItems[prop];
			storeItem.name = prop;
			const popupItem = new PopupItem( storeItem );

			this.popupItems.push( popupItem );

		}

		if ( this.popupItems.length > 0 ) {

			this.popupItems.forEach( popupItem => {

				popupItem.onLoadClick.add( data => {

					xyController.loadPathData( data );

				} );

				this.$renderArea.appendChild( popupItem.$el );

			} );

		} else {

			this.$renderArea.innerHTML = 'Automation Stores Empty';

		}

	}

	afterOpen() {

	}

}

