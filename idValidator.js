;(function($){

	var dupeIds = {};
	var ids = {};

	var __pushId = function($elm) {
		var elmId = $elm.attr("id");
		if (elmId != null) {
			if (ids[elmId] != null) {
				dupeIds[elmId] = $elm; 
			}
			else {
				id[elmId] = $elm; 
			}
			
		}	
	};

	var __initIds = function($elm) {
		
		__pushId($elm);
		
		$("[id]", $elm).each(function($item){
			__pushId($item);	
		});
	};

	var __checkDuplicate = function(value, attr) {
		attr = attr || "id";

		if (attr === "id") {
			return dupeIds[value];
		}
	}
	

	$.fn.idvalidator = function( options ) {



        if ( methods[options] && slider) {
          methods[options](slider, Array.prototype.slice.call( arguments, 1));
          
        } else if ( typeof options === 'object' || ! options ) {
            
            options = options || {};
            


            return this;
        } else {
            $.error( 'Method ' +  options + ' does not exist on jQuery' );
        }  
})()