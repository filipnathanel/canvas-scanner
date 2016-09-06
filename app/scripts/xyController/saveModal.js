import popup from '../popup/popup';
import * as utils from '../utils/utils';
import Globals from '../globals';

export default class saveModal {

	constructor(){

		this.$el = utils.getEl('.save-popup');

		this.init();
		this.initEvents();

	}

	init(){
		
		this.popup = new popup(this.$el, { 
			// 'trigger': '.control--save',
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

		let self = this;

		function enterListener(e){

			if( e.keyCode === 13 ){

				self.submitData();

				document.removeEventListener('keypress' , enterListener);

			}
		}

		this.$input.focus();
	
		document.addEventListener('keypress', enterListener);

	}

	onEnterClick(){
		this.submitData();
	}

	prepare(data){
		this.dataToSave = data;
		this.popup.openOverlay();
	}

	submitData(){

		let fileName = this.$input.value;
			fileName = fileName.replace(/ /g, '-');
		let now = new Date();
		let saveName = fileName + '_' + now.getFullYear() + '_' + now.getMonth() + '_' + now.getDay() + '_' + now.getHours() + ':' + now.getMinutes();
		
		Globals.automationStore.set(saveName, this.dataToSave);

		this.popup.closeOverlay();

	}



}
