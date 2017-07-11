import * as utils from './utils';
import EventQueue from './eventQueue';

export default class onResize extends EventQueue {

	constructor() {

		super();

		this.throttleTime = 200;

		this.listener();

	}

	listener() {

		window.addEventListener( 'resize', () => {

			// throttle the events
			utils.waitForFinalEvent( () => {

				this.run();

			}, this.throttleTime, 'resizerFunc' );

		} );


	}

}
