import * as utils from './utils/utils';
import onResize from './utils/onResize';
import saveModal from './xyController/saveModal';
import loadModal from './xyController/loadModal';
import Store from './utils/store';

let Globals = {
	get viewport () { return utils.updateViewportDimensions() },
	onResize: new onResize(),
	saveModal: new saveModal(),
	loadModal: new loadModal(),
	automationStore: new Store('Automations'),

};

window.globals = Globals;

export { Globals as default};