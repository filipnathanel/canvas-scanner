import {getEl, extend} from '../utils/utils';


export default class TutorialStep {
	
	constructor($el, message){
		this.$el = getEl($el)
		this.message = message;
	}

	highlightEl(){

		this.addPlaceholder(this.$el);

		Object.assign(this.$el.style, {position:'absolute', zIndex:'30'});

	}

	addPlaceholder($el){

		const $parent = $el.parentNode;
		const $wrapped = this.wrapEl($el);

		$parent.replaceChild($wrapped, $el);
		this.$el = getEl('#'+this.$el.id); // we need to reassign it as the old reference is gone
	}

	/**
	 * The idea is to wrap target element in a div
	 * that will placehold the absolutely positioned
	 * target element when it will be highlighted 
	 * @param  {Element} $el the Element we want to wrap
	 * @return {Element} $el wrapped in div (or something);
	 */
	wrapEl($el){
		
		const wrapper = document.createElement('div');

		wrapper.className = 'wrapper';
		Object.assign(wrapper.style, this.cloneStyles($el));

		wrapper.appendChild($el.cloneNode(true));
		return wrapper;

	}

	/**
	 * As for now We only need to set c
	 * @param  {[type]} pattern [description]
	 * @return {[type]}         [description]
	 */
	cloneStyles(pattern){

		const dimensions = pattern.getBoundingClientRect();
		const style = pattern.style;
		const computedStyle = getComputedStyle(pattern, null);

		return {
			display: style.display ? style.display : computedStyle.display,
			width: dimensions.width.toFixed(2) + 'px',
			height: dimensions.height.toFixed(2) + 'px',
			position: style.position ? style.position : computedStyle.position,
			verticalAlign: 'middle'
		}
	}
	
}