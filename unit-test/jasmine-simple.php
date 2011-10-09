<script>
// fake jasmine

function describe(des, cb){
	var old_des = _des;

	_des += ' > ' + des;
	
	cb();
	
	_des = old_des;
};


function expect(result){

	return {
		toBeTruthy: function(){
			_expect(result, true);
		},
		
		toBeFalsy: function(){
			_expect(result, false);
		},
		
		toBeUndefined: function(){
			_expect(result, undefined);
		},
		
		toEqual: function(v){
			_expect(result, v);
		}
	}
};


function _expect(result, exp){
	var div = document.createElement('div');
	
	des = _des;
	
	div.innerHTML = result === exp ? 
		des + ' >> <span style="color:green">passed</span>' :
		des + ' >> <span style="color:red">failed</span>: expect ' + result + ' to be ' + exp;
		
	body.appendChild(div);
};


var _des = '', it = describe,
	body = document.getElementsByTagName('body')[0];


</script>