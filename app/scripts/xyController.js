import * as utils from './utils/utils';
import Globals from './globals';

export default class XYController{
	constructor(controller, context){
		this.controller = utils.getEl(controller, context);
	}
}