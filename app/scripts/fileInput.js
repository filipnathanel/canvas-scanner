import EventQueue from './utils/eventQueue';
import * as utils from './utils/utils';

export default class FileInput {
	
	constructor(inputEl){
		this.$el = utils.getEl(inputEl);
		this.onFileChanged = new EventQueue();

		this.initEvents();

	}

	initEvents(){

		this.$el.addEventListener('change', 
			(e) => { 
				this.onFileChanged.run({ file:this.$el.files[0] }) ;
			});

	}

	


}