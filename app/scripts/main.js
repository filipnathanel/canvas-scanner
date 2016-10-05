import Scanner from './scanner';
import FileInput from './fileInput';
import loadIcons from './utils/loadIcons';

/**
 * This is a main file to scaffold the application
 */

document.addEventListener('DOMContentLoaded', ()=>{

	let glitchScanner = new Scanner('.scanner');
	let fileInput = new FileInput('#img_upload');
		
	fileInput.onFileChanged.add( ( file ) => { glitchScanner.addFile(file) });
	fileInput.onWrongFileType.add( ( result ) => { alert( result.type + ' is not allowed file type, try jpeg or png');});

	loadIcons();

});