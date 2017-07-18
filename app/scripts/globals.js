import * as utils from './utils/utils';
import OnResize from './utils/onResize';
import SaveModal from './xyController/saveModal';
import LoadModal from './xyController/loadModal';
import Store from './utils/store';

const Globals = {
	get viewport() {

		return utils.updateViewportDimensions();

	},
	onResize: new OnResize(),
	saveModal: new SaveModal(),
	loadModal: new LoadModal(),
	automationStore: new Store( 'Automations' ),

};

window.globals = Globals;

export { Globals as default };
