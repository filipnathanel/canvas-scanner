export default class SVGUtils{

	static mousePos(e, svg){

		var pt = svg.createSVGPoint();

		pt.x = e.clientX;
		pt.y = e.clientY;

		return pt.matrixTransform(svg.getScreenCTM().inverse());

	}

	/**
	 * TRANSORMATIONS FUNCTIONS
	 */

	static absWToRel(px, $svg){
		return px * 100 / SVGUtils.width($svg);
	}

	static absHToRel(px, $svg){
		return px * 100 / SVGUtils.height($svg);
	}

	static relWToAbs(percent, $svg){
		return percent/100 * SVGUtils.width($svg);
	}

	static relHToAbs(percent, $svg){
		return percent/100 * SVGUtils.height($svg);
	}

	static width($svg){
		var box = $svg.getBoundingClientRect();
		return box.right-box.left;
	}

	static height($svg){
		var box = $svg.getBoundingClientRect();
		return box.bottom-box.top;
	}

}