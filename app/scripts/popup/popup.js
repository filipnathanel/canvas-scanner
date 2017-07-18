import * as utils from '../utils/utils';

/**
 * A simple vanilla JS popup library
 * @param  {string} overlayEl css Type selector
 * @param  {object} options   a config object
 * @return {popupOverlay}     a popup object exposing control methods
 *
 * options Object defaults:
 * {
 * 	trigger : '.popup-trigger',
 * 	closeButton: '.popup-close',
 * 	container: '.popup-container'
 * }
 * 
 */

const defaults = {
	trigger: '.popup-trigger',
	closeButton: '.popup-close',
	container: '.popup-container',
};

export default class popupOverlay {

	constructor( overlay, options ) {

		this.$el = utils.getEl( overlay );

		if ( this.$el ) {

			this._init( options );

		} else {

			console.log( 'supplied popup element doesn\'t exist' );

		}

		// bind this value to eventHandler
		// this is one of the way to achieve nice event add/remove functionality
		this.onEscPress = this.onEscPress.bind( this );

	}

	_init( options ) {

		this.options = utils.extend( defaults, options );
		this._layout();
		this._initEvents();

	}

	_layout() {

		if ( !this.$el.classList.contains( 'close' ) || !this.$el.classList.contains( 'open' ) ) {

			this.open = false;
			this.$el.classList.add( 'close' );

		} else if ( this.$el.classList.contains( 'open' ) ) {

			this.open = true;

		} else {

			this.open = false;
			this.$el.classList.add( 'close' );

		}

	}

	_initEvents() {

		const self = this;
		const transEndEventNames = {
			WebkitTransition: 'webkitTransitionEnd',
			MozTransition: 'transitionend',
			OTransition: 'oTransitionEnd',
			msTransition: 'MSTransitionEnd',
			transition: 'transitionend'
		};

		self.transEndEventName = transEndEventNames.transition;
		// self.supports = { transitions: Modernizr.csstransitions};
		self.supports = { transitions: true };

		const triggers = utils.getEls( self.options.trigger );

		if ( triggers.length > 0 ) {

			for ( const trigger of triggers ) {

				trigger.addEventListener( 'click', event => {

					self.triggerHandler( event, self );

				} );

			}

		}

		if ( self.options.closeButton && self.$el.querySelector( self.options.closeButton ) ) {

			self.$el.querySelector( self.options.closeButton )
			.addEventListener( 'click', event => {

				self.triggerHandler( event, self );

			} );

		}
        
	}

    triggerHandler( event, ref ){
        var self = ref;

        if(self.open === false){
            self.openOverlay();
        } else if (self.open === true){
           self.closeOverlay(); 
        }
        
    }

    openOverlay(){
        var self = this;

        self.loadContent();

        self.$el.classList.remove( 'close' );
        self.$el.classList.add( 'open' );
        document.body.classList.add( 'popup-opened' );
        self.addOverlayClick();
        self.addEscListener();

        var container = document.querySelector(self.options.container),
            vh = utils.updateViewportDimensions().height,
            popupHeight = container.offsetHeight;

        if ( self.supports.transitions ){

            self.$el.classList.add( 'on-popup-open' );

            function onTransitionEnd(ev){

                self.$el.classList.remove( 'on-popup-open' );
                self.$el.removeEventListener( self.transEndEventName, onTransitionEnd);

                if (typeof self.options.afterOpen === 'function' ){
                    self.options.afterOpen();
                }

            }

            self.$el.addEventListener( self.transEndEventName, onTransitionEnd );

        }
        
        this.open = true;

    }
    closeOverlay(){   
        var self = this;

        self.$el.classList.remove( 'open' );
        self.$el.classList.add( 'close' );
        document.body.classList.remove( 'popup-opened' );
        self.removeOverlayClick();
        self.removeEscListener();

       if ( self.supports.transitions ){

            function onTransitionEnd(ev){
              if( ev.propertyName !== 'visibility' ) return;
                self.$el.classList.remove( 'close' );
                self.unloadContent();
                self.$el.removeEventListener( self.transEndEventName, onTransitionEnd);
            }
            self.$el.addEventListener( self.transEndEventName, onTransitionEnd);

        } else {
            self.$el.classList.remove( 'close' );
            self.unloadContent();
        }
        
        self.removeOverlayClick( event );
        self.open = false;
    }

    loadContent(){

    }

    unloadContent(){

    }

    onOverlayClick(event,clickRef){

        var self = this;

        if (event.target != clickRef){
            return;
        } else {
            self.closeOverlay();
        }

    }

    addOverlayClick( event ){
        var self = this;
        this.$el.addEventListener( 'click', function(e){self.onOverlayClick(e,this)} );
    }

    removeOverlayClick(event){
        var self = this;
        this.$el.removeEventListener( 'click', function(e){self.onOverlayClick(e,this)} );
    }

    addEscListener(){
        document.addEventListener( 'keydown', this.onEscPress );
    }

    removeEscListener(){
        document.removeEventListener( 'keydown', this.onEscPress );
    }

    onEscPress(e){
        if (e.keyCode === 27){
            this.closeOverlay();
        }
    }

}