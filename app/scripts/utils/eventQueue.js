export default class EventQueue {

	constructor(){
		this.queue = [];
	}
  	add(callback){
  		this.queue.push(callback);
  	}
  	run(data){
  		console.log(this);
		this.queue.forEach((callback)=>{
			if (typeof callback === 'function') callback(data);
		});
  	}

}