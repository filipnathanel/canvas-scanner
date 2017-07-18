import SVGUtils from '../utils/svgUtils';
import Emitter from '../utils/emitter';

import Circle from './circle';


export default class PathPoint extends Emitter {

	constructor( x, y, type = 'linear', slope = 0 ) {

		super();

		this.x = x;
		this.y = y;
		this.type = type;
		this.slope = slope;

	}


	/**
	 * A function to render the circle on given svg Element
	 * @param  {SVGElement} $svg An SVG Element on which we will render the point
	 * @return {void}
	 */
	render( $svg ) {

		const maxWidth = SVGUtils.width( $svg );
		const x = SVGUtils.relWToAbs( this.x, $svg );
		const y = SVGUtils.relHToAbs( this.y, $svg );
		let size;

		if ( x < 0 || x > maxWidth ) {

			size = 6;

		} else {

			size = 4;

		}

		this.circle = new Circle( {
			cx: x,
			cy: y,
			r: size,
		}, $svg );

		this.circle.el.classList.add( 'automation-point' );

		this.circle.el.addEventListener( 'mousedown', ( e ) => {

			this.onCircleLeftClick( e, $svg );

		} );

		this.circle.el.addEventListener( 'contextmenu', ( e ) => {

			this.onCircleRightClick( e );

		} );

	}

	// updatePos( oldPoint, newPoint ){

	// }

	onCircleLeftClick( e, $svg ) {

		e.preventDefault();
		const circle = e.target;

		const selectedCircle = e.target;
		const clickPos = SVGUtils.mousePos( e, $svg );
		const posDiff = {

			x: selectedCircle.getAttribute( 'cx' ) - clickPos.x,
			y: selectedCircle.getAttribute( 'cy' ) - clickPos.y

		};

		const dragHandler = ( dragEvent ) => {

			const movePos = SVGUtils.mousePos( dragEvent, $svg );
			let xPos = movePos.x + posDiff.x;
			let yPos = movePos.y + posDiff.y;

			// guard the xPos
			if ( xPos < 0 ) {

				xPos = 0;

			} else if ( xPos > SVGUtils.width( $svg ) ) {

				xPos = SVGUtils.width ($svg );

			}

			// guard the yPos
			if ( yPos < 0 ) {

				yPos = 0;

			} else if ( yPos > SVGUtils.height( $svg ) ) {

				yPos = SVGUtils.height( $svg );

			}

			this.trigger( 'update', {
				point: this,
				circle,
				xPos,
				yPos
			} );

		};

		function onMouseUp() {

			document.removeEventListener( 'mousemove', dragHandler );
			document.removeEventListener( 'mouseup', onMouseUp );

		}

		// attach drag handler
		document.addEventListener( 'mousemove', dragHandler );
		// listen for the drag end
		document.addEventListener( 'mouseup', onMouseUp );

	}

	onCircleRightClick( e ) {

		e.preventDefault();
		e.stopPropagation();

		this.removeCircle();

	}

	removeCircle() {

		this.circle.el.remove();
		this.circle = undefined;

		this.trigger( 'remove',
			{ point: this }
		);

	}

}
