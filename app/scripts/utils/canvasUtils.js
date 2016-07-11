export default class CanvasUtils {
	
	static mousePos(e, canvas){

		var rect = canvas.getBoundingClientRect(), 
		scaleX = canvas.width / rect.width,    
		scaleY = canvas.height / rect.height;  

		return {
			x: (e.clientX - rect.left) * scaleX, 
			y: (e.clientY - rect.top) * scaleY    
		}
	}

}