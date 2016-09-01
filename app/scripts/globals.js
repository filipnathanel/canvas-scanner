import * as utils from './utils/utils';
import onResize from './utils/onResize';
import saveModal from './xyController/saveModal';

let Globals = {
	get viewport () { return utils.updateViewportDimensions() },
	onResize: new onResize(),
	saveModal: new saveModal(),
	// automationStore: new Store('Automations'),

};

window.globals = Globals;

export { Globals as default};