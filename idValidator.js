;(function($){

	var DUPE_CLASS = "idvalidator-dupe";
	var VALIDATOR_ROOT_CLASS = "idvalidator-root";
	var DUPE_ID_CLASS = "idvalidator-dupe-id";
	var DUPE_DATA_ATTR = "data-idvalidator-dupe";
	var DUPE_DATA_NAME = "dupes";
	var ID_CONTAINER_CLASS = "idvalidator-id-decorator";
	var HIGHLIGHT_CLASS = "idvalidator-highlighted";
	var POSITIONED_CALSS = "idvalidator-positioned";


   var __clean = function ($elm) {
		var repIds = $elm.data(DUPE_DATA_NAME);


		for(key in repIds) {
			if (repIds.hasOwnProperty(key)) {
				var elms = repIds[key];
				for  (var i =0; i < elms.length; i++) {
					var $item  = elms[i];
					
					$item
						.removeClass(DUPE_CLASS + " " + DUPE_ID_CLASS )
						.removeClass(POSITIONED_CALSS)
						.attr(DUPE_DATA_ATTR, null);
					$item.children("."+ID_CONTAINER_CLASS).remove();
					
					
				}

			}
		}

		__cleanHighlight($elm);

		__removeHoverHandlers($elm);
				

		$elm.data(DUPE_DATA_NAME, null);
		$elm.removeClass(VALIDATOR_ROOT_CLASS);

		//child idvalidators must be clean as well
		$("." + VALIDATOR_ROOT_CLASS, $elm)
			.removeClass(VALIDATOR_ROOT_CLASS)
			.data(DUPE_DATA_NAME, null);
		
		return $elm;
	};

    function __getDupesFromElm ($elm) {
			return $elm.data(DUPE_DATA_NAME);
	};


	function __handlerMouseover(evt, args) {
		evt.preventDefault();

		var $elm = $(evt.target).closest("."+DUPE_CLASS);

		if ($elm.size() ===  0)  {
			return;
		}

		var id = $elm.attr("id");

		__highlight($([".", DUPE_CLASS,"[id=", id ,"]"].join("")), id);	
		
	};

	function __handlerMouseout(evt, args) {
		
		evt.preventDefault();

		var $elm = $(evt.target).closest("."+DUPE_CLASS);

		if ($elm.size() ===  0)  {
			return;
		}

		var id = $elm.attr("id");

		__removeElmHighlight($([".", DUPE_CLASS,"[id=", id,"]"].join("")), id);
		
	};

	function __removeHoverHandlers($elm) {
		$elm.off("mouseover", __handlerMouseover);
		$elm.off("mouseout", __handlerMouseout);
			
	};

	function __addHoverHandlers($elm) {
		$elm.on("mouseover", __handlerMouseover);
		$elm.on("mouseout", __handlerMouseout);
			
	};

	function __highlight ($elm, id) {
			$elm.addClass(HIGHLIGHT_CLASS).addClass(HIGHLIGHT_CLASS + "-" + id);
	};

/**
 *	Highliths
 */
	function __removeElmHighlight ($elm, id) {
		$elm.removeClass(HIGHLIGHT_CLASS);
		$elm.removeClass(HIGHLIGHT_CLASS+"-"+id)
	};

	function __removeHighlight  (dupes, id) {

		var arrDupes = dupes[id];
		for(var i=0; i < arrDupes.length; i++) {
			var $elm = arrDupes[i];
			__removeElmHighlight($elm, id);
		}
		
	};

	function __decorateDupeElm ($elm, elmId, config){
		if (!config.dry) {
			$elm.addClass(DUPE_CLASS + " "+ DUPE_ID_CLASS);
			$elm.attr(DUPE_DATA_ATTR, elmId);

		}

		if (config.decorate) {
			var deco = $("<div class='"+ID_CONTAINER_CLASS+"'>");
			deco.text("#"+elmId);

			//set positioned parent element for deco placement
			if ($elm.css("position") === "static") {
				$elm.addClass(POSITIONED_CALSS);
			}

			$elm.prepend(deco);
		}
			
	};

	function __cleanHighlight ($elm) {

			var highlighted = $("."+HIGHLIGHT_CLASS, $elm);
			highlighted.each(function(idx, item){
				var $item = $(item);
				var id = $item.attr("id");
				__removeElmHighlight($item, id);
			})
		};

	function __highlightAllDupes (dupes) {
		for (key in dupes) {
			if(dupes.hasOwnProperty(key)) {
				__highlightDupes(dupes, key);
			}
		}
	}

	function __highlightDupes (dupes, id) {

		var arrDupes = dupes[id];

		var length = arrDupes != null? arrDupes.length : 0;
		for(var i=0; i < length; i++) {
			__highlight(arrDupes[i], id);
		}
	};

	function __removeAllHighlights (dupes) {

		for (key in dupes) {
			if(dupes.hasOwnProperty(key)) {
				__removeHighlight(dupes, key);
			}
		}

		
	};


	$.fn.idvalidator = function( options ) {

		prop = $.extend({
			dry : false,
			decorate : false,
			highlight : false,
			highlightOnHover : false
		}, options);

		dupeIds = {};
		ids = {};
		

		var __pushId = function($elm) {
			var elmId = $elm.attr("id");
			if (elmId != null) {


				if (dupeIds[elmId] != null) {
					dupeIds[elmId].push($elm);
					__decorateDupeElm($elm, elmId, prop);
					
				} else if (ids[elmId] != null) {
					__decorateDupeElm(ids[elmId], elmId, prop);
					__decorateDupeElm($elm, elmId, prop);
					
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
			
			$("[id]", $elm).each(function(idx, item){
				__pushId($(item));	
			});

		};

		var __init = function($elm) {

			if (prop.highlightOnHover) {
				__addHoverHandlers($elm);
			}
			
			__initIds($elm);
			
			$elm.addClass(VALIDATOR_ROOT_CLASS);
			$elm.data(DUPE_DATA_NAME, $.extend({},dupeIds));

			if (prop.highlight) {
				__highlightAllDupes(dupeIds);

			}
		};
		

		var __checkDuplicate = function(value, attr) {
			attr = attr || "id";

			if (attr === "id") {
				return dupeIds[value];
			}
		};

		var __getDupes = function($elm) {
			prop.dry = true;

			var objDupes = __getDupesFromElm($elm);

			//return object stored in the element if exist (i.e. idvalidator alreay been called)
			if  (objDupes != null) {
				return objDupes;
			}

			__initIds($this);
			return dupeIds;
		}


		var $this = this;
		
		//Available methods for idvalidator
		var methods = {

			init : function () {
				__init($this);
				return $this;
			},
			clean : function() {
				return __clean($this);
			},
			getRepeatedIds : function(){
				return __getDupes($this);
			},

			highlight : function () {
				var id = arguments[0];
				var dupes = __getDupes($this);
				if (id != null) {
					__highlightDupes(dupes, id);
				} else {
					__highlightAllDupes(dupes);
				}
				return $this;
			},

			removeHighlight : function () {
				var id = arguments[0];
				var dupes = __getDupes($this);
				if (id != null) {
					__removeHighlight(dupes, id);
				} else {
					__removeAllHighlights(dupes);
				}
				return $this;
			},


		}


        if ( methods[options] ) {
          return methods[options].apply(this,Array.prototype.slice.call( arguments, 1));
          
        } else if ( typeof options === 'object' || !options ) {
            
            return methods.init();
            
        } else {
            $.error( 'Method ' +  options + ' does not exist on idvalidator' );
        }  
    }
})(jQuery)