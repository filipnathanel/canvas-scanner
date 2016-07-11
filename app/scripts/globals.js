import * as utils from './utils/utils';
import onResize from './utils/onResize';

let Globals = {
	get viewport () { return utils.updateViewportDimensions() },
	onResize: new onResize()
};

export { Globals as default};