import Scanner from './scanner';
import FileInput from './fileInput';

document.addEventListener('DOMContentLoaded', ()=>{
	var glitchScanner = new Scanner('.scanner');
	var fileInput = new FileInput('#img_upload');
		
	fileInput.onFileChanged.add( ( file ) => { glitchScanner.addFile(file) });
	fileInput.onWrongFileType.add( ( result ) => { alert( result.type + ' is not allowed file type, try jpeg or png');});

});	