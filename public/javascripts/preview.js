var page = require('webpage').create();

var url = 'http://phantomjs.org/quick-start.html';

//SPECIFY VIEWPORT SIZE OF THE SCREENCAPTURE
page.viewportSize = {
	width: 1280,
	height: 900
};

//SPECIFY CLIP RECTANGLE SIZE OF THE SCREENCAPTURE
page.clipRect = {
	top: 0,
	left: 0,
	width: 1280,
	height: 1280
};

//CAPTURE CONSOLE MESSAGES
page.onConsoleMessage = function(msg) {
	console.log("console message: " + msg);
};

page.open(url, function(status) {

	page.evaluate(function() {
		console.log(document.title);
	});

	page.render('/javascripts/screenshot.png');
	phantom.exit();
});
