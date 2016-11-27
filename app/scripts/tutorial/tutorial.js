import {getEl} from '../utils/utils';
import TutorialStep from './tutorialStep';


export default class Tutorial {
	
	constructor(){
		console.log('Tutorial initialised');

		// this.init();
	}

	init(){
		
		const step1 = new TutorialStep('#choose-file', `first let's select an image file that we will be processing, click on the highlighted button`);
		const step2 = new TutorialStep('#x-controller .xy-controller__area', `first let's select an image file that we will be processing, click on the highlighted button`);
		// this.steps = [step1, step2];
		
		step1.highlightEl();
		this.showOverlay()

		// console.log(step2);
	}

	showOverlay(){
		const $overlay = getEl('.tutorial-overlay');

		$overlay.classList.add('active');
	}

	
}