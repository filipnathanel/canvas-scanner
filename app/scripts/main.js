import Scanner from './scanner';
import FileInput from './fileInput';
import loadIcons from './utils/loadIcons';
import Tutorial from './tutorial/tutorial';
/**
 * This is a main file to scaffold the application
 */
const testowanko = true;


document.addEventListener('DOMContentLoaded', ()=>{

	window.glitchScanner = new Scanner('.scanner');
	const fileInput = new FileInput('#img_upload');
		
	fileInput.onFileChanged.add( ( file ) => { 
		console.log(file);
		glitchScanner.addFile(file) 
	});
	fileInput.onWrongFileType.add( ( result ) => { alert( result.type + ' is not allowed file type, try jpeg or png');});

	loadIcons();

	const tutorial = new Tutorial();

});




window.addEventListener('load', () => {

	if(testowanko){

		setTimeout( () => {

			window.glitchScanner.addFile({file: new File ( ) })

		}, 100);

	}
});