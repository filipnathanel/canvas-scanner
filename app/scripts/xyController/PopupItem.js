import EventQueue from '../utils/eventQueue';
import * as utils from '../utils/utils';
import Globals from '../globals';

export default class PopupItem {

	constructor( storeItem ) {

		this.storeItem = storeItem;
		this.cssClass = 'load-modal__item';
		this.onLoadClick = new EventQueue();

		this.init();

	}

	init() {

		this.itemName = this.storeItem.name;
		this.$el = this.render();

		this.$load = utils.getEl( `.${this.cssClass}__load`, this.$el );
		this.$delete = utils.getEl( `.${this.cssClass}__delete`, this.$el );

		this.initEvents();

	}

	initEvents() {

		this.$load.addEventListener( 'click', this.load.bind( this ) );
		this.$delete.addEventListener( 'click', this.delete.bind( this ) );

	}

	render() {

		const el = document.createElement( 'div' );
		el.classList.add( this.cssClass );

		const template = `<div class="${this.cssClass}__name field">${this.itemName}</div>
			<div class="${this.cssClass}__load control" title="load"><div class="icon"><svg viewBox="0 0 32 32" xml:space="preserve"><use xlink:href="#download"></use></svg></div></div>
			<div class="${this.cssClass}__delete control" title="delete"><div class="icon"><svg viewBox="0 0 32 32" xml:space="preserve"><use xlink:href="#repeat"></use></svg></div></div>`;

		el.innerHTML = template;

		return el;

	}

	load() {

		this.onLoadClick.run( this.storeItem );

	}

	delete() {

		Globals.automationStore.remove( this.storeItem );
		this.$el.remove();
		console.log( 'deleteClicked' );

	}

}
