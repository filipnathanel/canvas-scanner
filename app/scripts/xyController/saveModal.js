import popup from '../popup/popup';
import * as utils from '../utils/utils';

export default class saveModal {

	constructor(){

		this.$el = utils.getEl('.save-popup');

		this.init();
		this.initEvents();

	}

	init(){
		
		this.popup = new popup(this.$el, { 
			'trigger': '.control--save',
			'afterOpen' : () => { this.afterOpen(); }
		});

		this.$input = utils.getEl('input', this.$el);
		this.$enter = utils.getEl('.enter', this.$el);

	}

	initEvents(){

		this.$enter.addEventListener('click', (e) => {
			e.preventDefault();
			this.onEnterClick();
		} );

	}

	afterOpen(){

		function enterListener(e){

			if( e.keyCode === 13 ){

				this.submitData();

				document.removeEventListener('keypress' , enterListener);

			}
		}

		this.$input.focus();
	
		document.addEventListener('keypress', enterListener);

	}

	onEnterClick(){
		this.submitData();
	}

	submitData(){

		let fileName = this.$input.value;
			fileName = fileName.replace(/ /g, '-');
		let now = new Date();
		let saveName = fileName + '_' + now.getFullYear() + '_' + now.getMonth() + '_' + now.getDay() + '_' + now.getHours() + ':' + now.getMinutes();

		console.log(saveName);
		// Globals.automationStore.set(saveName, this.pathData.data);

		this.popup.closeOverlay();

	}



}
