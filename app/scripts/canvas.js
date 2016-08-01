import * as utils from './utils/utils';

export default class Canvas{

	constructor(scanArea, context){
		this.canvas = utils.getEl(scanArea, context);
		this.context = this.canvas.getContext('2d');

		// this is for landscape 72dpi
		this.a4BaseWidth = 842;
		this.a4BaseHeight = 595;
	}

	setDPI( dpi = 72 ){
		this.canvas.width = Math.round( this.a4BaseWidth  / 72 * dpi);
		this.canvas.height = Math.round( this.a4BaseHeight  / 72 * dpi);
	}
}