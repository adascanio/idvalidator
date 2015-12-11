function getSize(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function assertCleanElement (assert, $elm,  childSelector) {
	assert.ok($elm.data("dupes") == null, "No data is attached to element");
	assertDecoratedElement(assert, $elm, false, childSelector);
}

function asserDecoratedRoot (assert, $root, isDecorated) {
	var message = "idvalidator-root class decoration ";
	message += isDecorated? "added" : "not added";
	assert.ok($root.hasClass("idvalidator-root") == isDecorated, message);
}

function assertDecoratedElement (assert, $root, isDecorated, childSelector) {

	var prefix = "";

	var hasDataDeco = ($(childSelector, $root).attr("data-idvalidator-dupe") != null) == isDecorated;
	var hasClassDeco = $(childSelector, $root).hasClass("idvalidator-dupe") == isDecorated;
	if  (!isDecorated) {
		prefix = "No  ";
		
	}

	assert.ok(hasClassDeco, prefix + "class decoration is added to " + childSelector +" item");
	assert.ok(hasDataDeco, prefix + "attribute decoration is added to " + childSelector + " item");
}

function assertDryElement (assert, $elm, childSelector) {
	assert.ok($elm.data("dupes"), "Repeated ids data is attached to element");
	assertDecoratedElement(assert, $elm, false, childSelector);
	asserDecoratedRoot(assert, $elm, true);
}

function assertIdsObjectOnBody (assert, obj) {
	assert.equal(obj["repeated-id"].length,8, "Found 8 ids 'repeated-id'");
	assert.equal(obj["repeated-id-2"].length, 4, "Found 4 ids 'repeated-id-2'");
	assert.equal(obj["unique-id"].length, 3, "Found 3 ids 'unique-id'");
}

function assertCleanEmbedded (assert, $root, $child) {
	
	assert.ok( getSize($root.data("dupes")) > 0 , "Found dupes ok on root element, set up before cleaning" );
	assert.ok( getSize($child.data("dupes")) > 0 , "Found dupes ok on child, set up before cleaning" );
	
	$root.idvalidator("clean");

	assertCleanElement(assert, $root, "#repeated-id");
	assertCleanElement(assert, $child, "#repeated-id");
}

function getHighlighted($context, id) {
	return $(".idvalidator-highlighted.idvalidator-highlighted-" + id, $context);
}

function foundHighlights (howMany, id, under){

	return ["Found", howMany, "highlighetd", id,"under", under].join(" ");
}

QUnit.module("Perform Simple checks on ids", function(){

	
	QUnit.test( "Check detection of repeated ids", function( assert ) {

	  var $elm = $("#simple-check").idvalidator();



	  assert.ok( $elm.data("dupes") != null, "Found dupes" );
	  assert.equal( getSize($elm.data("dupes")), 1 , "One duplicate id found");

	});	

	
	QUnit.test( "Check css classed and data of elements with repeated ids", function( assert ) {

		$elm = $("#simple-check").idvalidator("clean");
		$elm = $("#simple-check").idvalidator();

		assert.ok($("#repeated-id", $elm).hasClass("idvalidator-dupe"), "dupe class added to the first repeated element");
		assert.ok($("#repeated-id", $elm).hasClass("idvalidator-dupe-id"), "dupe ID class added to the first repeated element");
		assert.equal($("#repeated-id", $elm).attr("data-idvalidator-dupe"), "repeated-id", "dupe id added to data attribute");
		assert.equal($(".idvalidator-dupe", $elm).length, 2, "found two elements with duplicate ids");

	});
});

QUnit.module("Perform Multiple checks on ids", function(){

	
	QUnit.test( "Check detection of repeated ids", function( assert ) {

		var $elm = $("#multiple-check").idvalidator("clean").idvalidator();
	

		assert.ok( getSize($elm.data("dupes")) > 0, "Found dupes" );
		assert.equal( getSize($elm.data("dupes")), 2 , "Two duplicate ids found");
		assert.equal( $elm.data("dupes")["repeated-id"].length, 3 , "duplicate id found three times");
	 
	});	
});

QUnit.module("Perform Embedded checks on ids", function(){

	
	QUnit.test( "Check detection of repeated ids", function( assert ) {
		var $elm = $("#embedded-check").idvalidator("clean").idvalidator();

		assert.ok( $elm.data("dupes") != null, "Found dupes: Passed!" );
		assert.equal( getSize($elm.data("dupes")), 2 , "One duplicate id found");
		assert.equal( $elm.data("dupes")["repeated-id"].length, 3 , "duplicate id (repeated-id) found three times");
		assert.equal( $elm.data("dupes")["repeated-id-2"].length, 2 , "duplicate id (repeated-id-2)found two times");


	});

	
	QUnit.test( "Check detection of repeated ids", function( assert ) {

		var $embElm = $("#embedded-check .container-embed").idvalidator("clean").idvalidator();


		assert.ok( $embElm.data("dupes") != null, "Found dupes: Passed!" );
		assert.equal( getSize($embElm.data("dupes")), 2 , "One duplicate id found");
		assert.equal( $embElm.data("dupes")["repeated-id"].length, 2 , "duplicate id (repeated-id) found two times");
		assert.equal( $embElm.data("dupes")["repeated-id-2"].length, 2 , "duplicate id (repeated-id-2)found two times");


	});	
});

QUnit.module("Perform Id checks on unique ids section ", function(){

	
	QUnit.test( "Check detection of repeated ids", function( assert ) {
		var $elm = $("#all-uniques").idvalidator();

		assert.ok( getSize($elm.data("dupes")) === 0 , "Dupes not found" );
		assert.ok( $elm.data("dupes")["repeated-id-1"] == null , "duplicate id (repeated-id) not found");
	
	});

});

QUnit.module("Perform Id checks on body ", function(){

	
	QUnit.test( "Check detection of repeated ids", function( assert ) {

		var $elm = $("body").idvalidator();

		assert.ok( $elm.data("dupes") != null, "Found dupes: Passed!" );
		assert.equal( getSize($elm.data("dupes")), 3 , "Three duplicate ids found");
		assert.equal( $elm.data("dupes")["repeated-id"].length, 8 , "duplicate id (repeated-id) found eight times");
		assert.equal( $elm.data("dupes")["unique-id"].length, 3 , "duplicate id (unique-id) found three times");

	});

});

QUnit.module("Check options and methods", function(){


	QUnit.test( "Check clean tags decoration: method clean", function( assert ) {
		var $cleanElm = $("body").idvalidator();

		assert.ok( getSize($cleanElm.data("dupes")) > 0 , "Found dupes ok, set up before cleaning" );
		$cleanElm = $("body").idvalidator("clean");

		assertCleanElement(assert, $cleanElm , "#repeated-id");
	});

	/**
	 * Cleaning parent element should clean also the element in idvalidators created from child elements
	 */
	QUnit.test( "Check clean tags decoration for embedded validator plugin: method clean", function( assert ) {
		var $cleanElm = $("body").idvalidator();

		var $simpleElm = $("#simple-check").idvalidator();

		assertCleanEmbedded(assert, $cleanElm, $simpleElm);
	});

	/**
	 * Set the list of repeated ids and corresponding elements if any.
	 * Class and data decoration is not added
	 */
	QUnit.test( "Check dry mode: option {dry: true}", function( assert ) {

		var $dryElm  = $("body").idvalidator("clean");
		$dryElm = $("body").idvalidator({dry : true});

		assertDryElement(assert, $dryElm);

		var dupes = $dryElm.data("dupes");
		assert.equal(getSize($dryElm.data("dupes")), 3, "Found 3 repeated id in dry element");

		assertIdsObjectOnBody(assert, dupes);

		
	});

	QUnit.test( "Check clean after dry mode", function( assert ) {

		var $dryElm  = $("body").idvalidator("clean");
		$dryElm = $("body").idvalidator({dry : true});

		assertDryElement(assert, $dryElm);

		$dryElm.idvalidator("clean");

		assertCleanElement(assert, $dryElm, "#repeated-id");
		
		
	});

	QUnit.test( "Check clean after dry mode embedded", function( assert ) {

		var $cleanElm = $("body").idvalidator("clean").idvalidator({dry : true});

		var $simpleElm = $("#simple-check").idvalidator("clean").idvalidator({dry : true});

		assertCleanEmbedded(assert, $cleanElm, $simpleElm);
		
		
	});

	QUnit.test( "Check method getRepeatedIds: Decoration is not done on any items and list of duplicate ids is returned", function( assert ) {

		var $body = $("body").idvalidator("clean");

		var duplicateItems = $body.idvalidator("getRepeatedIds");

		assertCleanElement(assert, $body, "#repeated-id");
		assertIdsObjectOnBody(assert, duplicateItems);
		
	});

	QUnit.test( "Check method getRepeatedIds: Decoration is not done on any items and list of duplicate ids is returned, no data is added on body", function( assert ) {

		var $body = $("body").idvalidator("clean");

		var duplicateItems = $body.idvalidator("getRepeatedIds");

		assertCleanElement(assert, $body, "#repeated-id");
		assertIdsObjectOnBody(assert, duplicateItems);
		assert.ok($body.data("dupes") == null, "No dupes data found on body tag");
		
	});

	QUnit.test( "Check method getRepeatedIds: duplicate is found on body directly and it is still there after retrieving, as well as the whole decoration", function( assert ) {

		var $body = $("body").idvalidator("clean").idvalidator();

		var duplicateItems = $body.idvalidator("getRepeatedIds");

		assertDecoratedElement(assert, $body, true, "#repeated-id");
		assertIdsObjectOnBody(assert, duplicateItems);
		assert.ok($body.data("dupes") != null, "Dupes data found on body tag");
		
		
	});

	/**
	 * Decorate the html elements with more tag for visual feedback
	 */
	QUnit.test( "Check enable decorator mode", function( assert ) {
		var $body = $("body").idvalidator("clean").idvalidator({decorate : true});

		var $idContainer = $("#repeated-id.idvalidator-dupe .idvalidator-id-decorator", $body);
		assert.ok($idContainer.size() > 0, "Container with repeated id contains an the id container element");

		$body = $("body").idvalidator("clean");
		$idContainer = $("#repeated-id.idvalidator-dupe .idvalidator-id-decorator", $body);

		assert.equal($idContainer.size(), 0, "Container with repeated id does not contain an id container element after cleaning");
		

	});


});

QUnit.module("Highlight module", function(){

	QUnit.test( "Given an non duplicate id, do nothing", function( assert ) {
		var $body = $("body").idvalidator("clean");

		var $simple = $("#simple-check").idvalidator("highlight", "unique-id");

		assert.equal($(".idvalidator-highlighted.idvalidator-highlighted-unique-id", $simple).size(), 0, "No unique-id under #simple-check");

		var $simple = $("#simple-check").idvalidator("clean").idvalidator("highlight", "non-existing-id");

		assert.equal($(".idvalidator-highlighted.idvalidator-highlighted-non-existing-id", $simple).size(), 0, "No non-existing-id under #simple-check");

		
	});

	QUnit.test( "Highlight single element", function( assert ) {
		
		var $simple = $("#simple-check").idvalidator("highlightOne");

		assert.ok($("#simple-check").hasClass("idvalidator-highlighted"), "Simple-check has been highlighted");

		
	});


	/**
	 * highlights are added with or withouth the decoration. 
	 */
	QUnit.test( "Given an id, highlights all classes if the id is duplicate ", function( assert ) {
		var $body = $("body").idvalidator("clean");

		var $simple = $("#simple-check").idvalidator("highlight", "repeated-id");

		assert.equal(getHighlighted($simple,"repeated-id").size(), 2, "Found 2 repeated-id under #simple-check");

		$body = $("body").idvalidator("highlight", "repeated-id");

		assert.equal(getHighlighted($body,"repeated-id").size(), 8, "Found 8 repeated-id under body");

		$body = $("body").idvalidator("highlight", "unique-id");

		assert.equal(getHighlighted($body,"unique-id").size(), 3, "Found 3 unique-id under body");

		
	});

	QUnit.test( "highlights all classes if the id is duplicate ", function( assert ) {
		var $body = $("body").idvalidator("clean");

		$body.idvalidator("highlight", "repeated-id");
		
		assert.equal(getHighlighted($body,"repeated-id").size(), 8, "Found 8 highlighetd repeated-id under body");
		assert.equal(getHighlighted($body,"unique-id").size(), 0, "No highlighted unique-id found under body");

		$body = $("body").idvalidator("highlight");

		assert.equal(getHighlighted($body,"unique-id").size(), 3, "Found 3 highlighted unique-id under body");
		assert.equal(getHighlighted($body,"repeated-id-2").size(), 4, "Found 4 highlighetd repeated-id-2 under body");

		
	});

	
	QUnit.test( "Check that higlights are correctly cleaned: partially , all, and with global clean ", function( assert ) {
		var $body = $("body").idvalidator("clean");

		var $simple = $("#simple-check").idvalidator({decorate : true}).idvalidator("highlight", "repeated-id");
		$body = $("body").idvalidator().idvalidator("highlight", "repeated-id");
		$body = $("body").idvalidator().idvalidator("highlight", "unique-id");
		$body = $("body").idvalidator().idvalidator("highlight", "repeated-id-2");

		$simple = $("#simple-check").idvalidator("removeHighlight", "repeated-id");

		assert.equal(getHighlighted($simple,"repeated-id").size(), 0, "Cleaned repeated-id under #simple-check");
		assert.equal(getHighlighted($body,"repeated-id").size(), 6, "Found 6 repeated-id under body after cleaning #simple-check");

		$body = $("body").idvalidator("removeHighlight", "repeated-id");
		assert.equal(getHighlighted($body,"repeated-id").size(), 0, "Cleaned repeated-id under body");
		assert.equal(getHighlighted($body,"unique-id").size(), 3, "Found 3 unique-id under body after cleaning #repeated-id");
		assert.equal(getHighlighted($body,"repeated-id-2").size(), 4, "Found 4 repeated-id-2 under body after cleaning #repeated-id");
		
		$body = $("body").idvalidator("clean");
		assert.equal(getHighlighted($body,"unique-id").size(), 0, "Cleaned unique-id under body after global clean");
		assert.equal(getHighlighted($body,"repeated-id-2").size(), 0, "Cleaned repeated-id-2 under body after global clean");
		
		$body = $("body").idvalidator().idvalidator("highlight");

		var $mutilple = $("#multiple-check").idvalidator("removeHighlight");
		assert.equal(getHighlighted($mutilple,"repeated-id").size(), 0, "Cleaned repeated-id under #multiple-check after clean all under #multiple-check");
		assert.equal(getHighlighted($mutilple,"unique-id").size(), 1, "Found unique-id  under #multiple-check after clean all under #multiple-check. unique-id is not duplicate for #multiple-check");
		assert.equal(getHighlighted($body,"repeated-id-2").size(), 2, "Found 2 repeated-id-2 under body after clean all under #multiple-check");
		
		

	});

	QUnit.test( "highlights all classes when initializing the widget ", function( assert ) {
		var $body = $("body").idvalidator("clean").idvalidator({highlight: true});

		assert.equal(getHighlighted($body,"repeated-id").size(), 8, foundHighlights(8, "repeated-id", "body"));
		assert.equal(getHighlighted($body,"unique-id").size(), 3, foundHighlights(3, "unique-id", "body"));
		assert.equal(getHighlighted($body,"repeated-id-2").size(), 4, foundHighlights(4, "repeated-id-2", "body"));

		$body.idvalidator("clean");

		$simpleCheck = $("#simple-check").idvalidator({highlight: true});
		assert.equal(getHighlighted($simpleCheck,"repeated-id").size(), 2, foundHighlights(2, "repeated-id", "#simple-check"));
		assert.equal(getHighlighted($simpleCheck,"unique-id").size(), 0, foundHighlights(0, "unique-id", "body"));
		
		$body.idvalidator("clean");
		
	});



});

QUnit.module("Mouse Over Callback", function(){

	QUnit.test("highlight and decorate the body", function(assert){

		var $body = $("body");
		$body.idvalidator("clean");

		$body.idvalidator({highlight:false, decorate:true, highlightOnHover:  true});

		$("#repeated-id").trigger( $.Event( "mouseover"));

		assert.equal(getHighlighted($body,"repeated-id").size(), 8, foundHighlights(8, "repeated-id", "body"));
	});

	QUnit.test("highlight and removehiglight to repeated-id under body", function(assert){

		var $body = $("body");
		$body.idvalidator("clean");

		$body.idvalidator({highlight:false, decorate:true, highlightOnHover:  true});

		$("#repeated-id").trigger( $.Event( "mouseover"));

		assert.equal(getHighlighted($body,"repeated-id").size(), 8, foundHighlights(8, "repeated-id", "body"));

		$("#repeated-id").trigger( $.Event( "mouseout"));

		assert.equal(getHighlighted($body,"repeated-id").size(), 0, foundHighlights(0, "repeated-id", "body"));



	});
})

// QUnit.module("Run plugin", function(){

	
// 	QUnit.test("highlight and decorate the multiple-check", function(assert){

// 		$("body").idvalidator("clean");

// 		//$("#multiple-check").idvalidator({highlight:false, decorate:false, highlightOnHover:  true});
// 		//$("#embedded-check").idvalidator({highlight:false, decorate:true, highlightOnHover:  true});
// 		$("body").idvalidator({highlight:false, decorate:true, highlightOnHover:  true});
// 		assert.ok(1==1,"Done!")
// 	});
// })



