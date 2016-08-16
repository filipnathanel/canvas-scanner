import Scanner from './scanner';
import FileInput from './fileInput';
import loadIcons from './utils/loadIcons';

document.addEventListener('DOMContentLoaded', ()=>{
	var glitchScanner = new Scanner('.scanner');
	var fileInput = new FileInput('#img_upload');
		
	fileInput.onFileChanged.add( ( file ) => { glitchScanner.addFile(file) });
	fileInput.onWrongFileType.add( ( result ) => { alert( result.type + ' is not allowed file type, try jpeg or png');});

	loadIcons();
});	