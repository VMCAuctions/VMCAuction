console.log('items.js');


function ItemsController(){
	this.greet = function(req,res){
		console.log('Hello, Valley Med');
		res.send('Puttin on the Ritz');
	};

  
}
module.exports = new ItemsController(); 