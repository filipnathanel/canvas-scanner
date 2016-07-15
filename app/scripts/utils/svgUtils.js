export default class SVGUtils{

	static mousePos(e, svg){

		var pt = svg.createSVGPoint();

		pt.x = e.clientX;
		pt.y = e.clientY;

		return pt.matrixTransform(svg.getScreenCTM().inverse());

	}

}