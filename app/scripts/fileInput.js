// razem z drop zone

import * as utils from './utils/utils';

export default class FileInput {
	
	constructor(inputEl){
		this.$el = utils.getEl(inputEl);

		this.initEvents();

	}

	initEvents(){
		console.log('file input events initialised');
		this.$el.addEventListener('input', (e) => {
			console.log('something inputted');
		});

		this.$el.addEventListener('load', (e) => {
			console.log('something loaded');
		});

		this.$el.addEventListener('change', (e) => {
			console.log('something changed');
		});


		this.$el.addEventListener('click', (e) => {
			console.log(this.$el);
		});
	}


}