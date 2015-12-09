function getSize(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function assertCleanElement (assert, $elm) {
	assert.ok($elm.data("dupes") == null, "No data is attached to element");
	assertNotDecoratedElement(assert, $elm);
}

function assertNotDecoratedElement (assert, $elm) {
	assert.ok($elm.hasClass("idvalidator-root") == false, "No class decoration is added to root item");
	assert.ok($("#repeated-id", $elm).hasClass("idvalidator-dupe") == false, "No class decoration is added to repeated id item");
	assert.ok($("#repeated-id", $elm).attr("data-idvalidator-dupe") == null, "No attribute decoration is added to repeated id item");
}

function assertDryElement (assert, $elm) {
	assert.ok($elm.data("dupes"), "Repeated ids data is attached to element");
	assertNotDecoratedElement(assert, $elm);
}

QUnit.module("Perform Simple checks on ids", function(){

	var $elm = $("#simple-check").idvalidator();

	QUnit.test( "Check detection of repeated ids", function( assert ) {


	  assert.ok( $elm.data("dupes") != null, "Found dupes" );
	  assert.equal( getSize($elm.data("dupes")), 1 , "One duplicate id found");

	});	

	$elm = $("#simple-check").idvalidator("clean");
	$elm = $("#simple-check").idvalidator();

	QUnit.test( "Check css classed and data of elements with repeated ids", function( assert ) {
		assert.ok($("#repeated-id", $elm).hasClass("idvalidator-dupe"), "dupe class added to the first repeated element");
		assert.ok($("#repeated-id", $elm).hasClass("idvalidator-dupe-id"), "dupe ID class added to the first repeated element");
		assert.equal($("#repeated-id", $elm).attr("data-idvalidator-dupe"), "repeated-id", "dupe id added to data attribute");
		assert.equal($(".idvalidator-dupe", $elm).length, 2, "found two elements with duplicate ids");

	});
});

QUnit.module("Perform Multiple checks on ids", function(){

	var $elm = $("#multiple-check").idvalidator("clean").idvalidator();
	
	QUnit.test( "Check detection of repeated ids", function( assert ) {

	  assert.ok( getSize($elm.data("dupes")) > 0, "Found dupes" );
	  assert.equal( getSize($elm.data("dupes")), 2 , "Two duplicate ids found");
	  assert.equal( $elm.data("dupes")["repeated-id"].length, 3 , "duplicate id found three times");
	 
	});	
});

QUnit.module("Perform Embedded checks on ids", function(){

	var $elm = $("#embedded-check").idvalidator("clean").idvalidator();

	QUnit.test( "Check detection of repeated ids", function( assert ) {

	  assert.ok( $elm.data("dupes") != null, "Found dupes: Passed!" );
	  assert.equal( getSize($elm.data("dupes")), 2 , "One duplicate id found");
	  assert.equal( $elm.data("dupes")["repeated-id"].length, 3 , "duplicate id (repeated-id) found three times");
	  assert.equal( $elm.data("dupes")["repeated-id-2"].length, 2 , "duplicate id (repeated-id-2)found two times");


	});

	var $embElm = $("#embedded-check .container-embed").idvalidator("clean").idvalidator();

	QUnit.test( "Check detection of repeated ids", function( assert ) {

	  assert.ok( $embElm.data("dupes") != null, "Found dupes: Passed!" );
	  assert.equal( getSize($embElm.data("dupes")), 2 , "One duplicate id found");
	  assert.equal( $embElm.data("dupes")["repeated-id"].length, 2 , "duplicate id (repeated-id) found two times");
	  assert.equal( $embElm.data("dupes")["repeated-id-2"].length, 2 , "duplicate id (repeated-id-2)found two times");


	});	
});

QUnit.module("Perform Id checks on unique ids section ", function(){

	var $elm = $("#all-uniques").idvalidator();

	QUnit.test( "Check detection of repeated ids", function( assert ) {

	  assert.ok( getSize($elm.data("dupes")) === 0 , "Dupes not found" );
	  assert.ok( $elm.data("dupes")["repeated-id-1"] == null , "duplicate id (repeated-id) not found");
	  

	});

});

QUnit.module("Perform Id checks on body ", function(){

	var $elm = $("body").idvalidator();

	QUnit.test( "Check detection of repeated ids", function( assert ) {

	  assert.ok( $elm.data("dupes") != null, "Found dupes: Passed!" );
	  assert.equal( getSize($elm.data("dupes")), 3 , "Three duplicate ids found");
	  assert.equal( $elm.data("dupes")["repeated-id"].length, 8 , "duplicate id (repeated-id) found eight times");
	  assert.equal( $elm.data("dupes")["unique-id"].length, 3 , "duplicate id (unique-id) found three times");


	});

});

QUnit.module("Check options ", function(){


	QUnit.test( "Check clean tags decoration", function( assert ) {
		var $cleanElm = $("body").idvalidator();

		assert.ok( getSize($cleanElm.data("dupes")) > 0 , "Found dupes ok, set up before cleaning" );
		$cleanElm = $("body").idvalidator("clean");

		assertCleanElement(assert, $cleanElm);
	});

	/**
	 * Cleaning parent element should clean also the element in idvalidators created from child elements
	 */
	QUnit.test( "Check clean tags decoration for embedded validator plugin", function( assert ) {
		var $cleanElm = $("body").idvalidator();

		var $simpleElm = $("#simple-check").idvalidator();

		assert.ok( getSize($cleanElm.data("dupes")) > 0 , "Found dupes ok on body, set up before cleaning" );
		assert.ok( getSize($simpleElm.data("dupes")) > 0 , "Found dupes ok on #simple-check, set up before cleaning" );
		
		$cleanElm = $("body").idvalidator("clean");

		assertCleanElement(assert, $cleanElm);
		assertCleanElement(assert, $simpleElm);
	});

	/**
	 * Return the list of repeated ids and corresponding elements if any.
	 * Class and data decoration is not added
	 */
	// QUnit.test( "Check dry mode", function( assert ) {

	// 	var $dryElm  = $("body").idvalidator("clean");
	// 	$dryElm = $("body").idvalidator({dry : true});

	// 	assertDryElement(assert, $dryElm);

	// 	// assert.ok($dryElm.data("dupes") == null, "No data is attached to element");
	// 	// assert.ok($("#repeated-id", $dryElm).hasClass("idvalidator-dupe") == false, "No class decoration is added to repeated id item");
	// 	// assert.equal( getSize($dryElm.data("dupes")), 3 , "Three duplicate ids found");
	// 	// assert.equal( $dryElm.data("dupes")["unique-id"].length, 3 , "duplicate id (unique-id) found three times");
	// });

	// /**
	//  * Decorate the html elements with more tag for visual feedback
	//  */
	// QUnit.test( "Check enable decorator mode", function( assert ) {

	// });

	// QUnit.test( "Check target element has duplicate id", function( assert ) {

	// });



});



