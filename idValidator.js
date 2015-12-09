;(function($){

	var DUPE_CLASS = "idvalidator-dupe";
	var VALIDATOR_ROOT_CLASS = "idvalidator-root";
	var DUPE_ID_CLASS = "idvalidator-dupe-id";
	var DUPE_DATA_ATTR = "data-idvalidator-dupe";
	var DUPE_DATA_NAME = "dupes";
		
	

	$.fn.idvalidator = function( options ) {

		var prop = $.extend({
			dry : false,
			decorate : true
		}, options);

		var dupeIds = {};
		var ids = {};

		var __decorateDupeElm = function($elm, elmId){
			$elm.addClass(DUPE_CLASS + " "+ DUPE_ID_CLASS);
			$elm.attr(DUPE_DATA_ATTR, elmId);

		};

		var __pushId = function($elm) {
			var elmId = $elm.attr("id");
			if (elmId != null) {

				if (dupeIds[elmId] != null) {
					dupeIds[elmId].push($elm);
					__decorateDupeElm($elm, elmId);
					
				} else if (ids[elmId] != null) {
					__decorateDupeElm(ids[elmId], elmId);
					
					//first time a duplicate is found, there are 2 identical ids
					dupeIds[elmId] = [$elm, ids[elmId]];
				}
				else {
					ids[elmId] = $elm; 
				}
				
			}	
		};

		var __initIds = function($elm) {
			
			__pushId($elm);
			$elm.addClass(VALIDATOR_ROOT_CLASS);
			
			$("[id]", $elm).each(function(idx, item){
				__pushId($(item));	
			});

			$elm.data(DUPE_DATA_NAME, $.extend({},dupeIds));
		};

		var __checkDuplicate = function(value, attr) {
			attr = attr || "id";

			if (attr === "id") {
				return dupeIds[value];
			}
		};

		var __clean = function ($elm) {
			var repIds = $elm.data(DUPE_DATA_NAME);

			for(key in repIds) {
				if (repIds.hasOwnProperty(key)) {
					var elms = repIds[key];
					for  (var i =0; i < elms.length; i++) {
						elms[i]
							.removeClass(DUPE_CLASS + " " + DUPE_ID_CLASS)
							.attr(DUPE_DATA_ATTR, null);
						
					}
						
				}
			}

			$elm.data(DUPE_DATA_NAME, null);
			$elm.removeClass(VALIDATOR_ROOT_CLASS);

			//child idvalidators must be clean as well
			$("." + VALIDATOR_ROOT_CLASS, $elm)
				.removeClass(VALIDATOR_ROOT_CLASS)
				.data(DUPE_DATA_NAME, null);
			
			return $elm;
		}


		var $this = this;
		
		//Available methods for idvalidator
		var methods = {

			init : function () {
					__initIds($this);
			},
			clean : function() {
				return __clean($this);
			}

		}


        if ( methods[options] ) {
          return methods[options]( Array.prototype.slice.call( arguments, 1));
          
        } else if ( typeof options === 'object' || !options ) {
            
            methods.init();
            return $this;
        } else {
            $.error( 'Method ' +  options + ' does not exist on idvalidator' );
        }  
    }
})(jQuery)