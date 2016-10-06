import popup from '../popup/popup';
import * as utils from '../utils/utils';
import EventQueue from  '../utils/eventQueue'
import Globals from '../globals';

export default class loadModal {

	constructor( ){

		this.$el = utils.getEl('.load-popup');

		console.log(this.$el);

		this.init();
		this.initEvents();

	}

	init(){
		
		this.popup = new popup(this.$el, { 
			// 'trigger': '.control--save',
			'afterOpen' : () => { this.afterOpen(); }
		});

		this.$renderArea = utils.getEl('.render-area', this.$el);

	}

	initEvents(){

	}

	/**
	 * opens the modal and sets the xyController into which we will be lading data
	 * @param  {object} xyController an instance of XYController
	 * @return void/undefined
	 */
	open( xyController ){

		this.renderStoreItems(xyController);
		this.popup.openOverlay();

	}

	close(){
		this.popup.closeOverlay();
	}

	renderStoreItems(xyController){

		this.popupItems = [];
		// refresh the renderArea
		this.$renderArea.innerHTML = "";

		let storeItems = Globals.automationStore.getAll();

		// construct popupItems from storeItems
		for( let prop in storeItems ){
			let storeItem = storeItems[prop];
			storeItem.name = prop;
			let popupItem = new PopupItem(storeItem);
			this.popupItems.push( popupItem );
		}

		if (this.popupItems.length > 0){
			this.popupItems.forEach((popupItem) => {
				
				popupItem.onLoadClick.add( (data) => {
					xyController.loadPathData(data);
				});

				this.$renderArea.appendChild(popupItem.$el);
			});
		}else{
			this.$renderArea.innerHTML = "Automation Stores Empty";
		}

	}

	afterOpen(){

	}

}

class PopupItem{

	constructor( storeItem ){
		
		this.storeItem = storeItem;
		this.cssClass = 'load-modal__item';
		this.onLoadClick = new EventQueue();

		this.init();

	}

	init(){
		this.itemName = this.storeItem.name;
		this.$el = this.render();

		this.$load = utils.getEl(`.${this.cssClass}__load`, this.$el);
		this.$delete = utils.getEl(`.${this.cssClass}__delete`, this.$el);

		this.initEvents();
	}

	initEvents(){
		this.$load.addEventListener('click', this.load.bind(this));
		this.$delete.addEventListener('click', this.delete.bind(this));
	}

	render(){

		let el = document.createElement('div');
		el.classList.add(this.cssClass);

		let template = `<div class="${this.cssClass}__name field">${this.itemName}</div>
			<div class="${this.cssClass}__load control"><div class="icon"><svg viewBox="0 0 32 32" xml:space="preserve"><use xlink:href="#download"></use></svg></div></div>
			<div class="${this.cssClass}__delete control"><div class="icon"><svg viewBox="0 0 32 32" xml:space="preserve"><use xlink:href="#repeat"></use></svg></div></div>`;

		el.innerHTML = template;

		return el;
	}

	load(){
		this.onLoadClick.run(this.storeItem);
	}

	delete(){
		console.log('deleteClicked');
	}
}