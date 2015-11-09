var phantom = require('phantom');

var pageUrl = "http://localhost:3000/profile/invoice/invoice-item?ID=in_173BCAAD0c2h1Hd0wGUQF87g";

var consoletest = function(){console.log($)};
var renderPDF = function(phantom){
	phantom.create("--ignore-ssl-errors=yes", "--ssl-protocol=any", function (ph) {//mMAKE SURE WE CAN RENDER https
		ph.createPage(function (page) {
			//CREATE PAGE OBJECT
			page.set('viewportSize', {width:1280,height:900}, function(){
				page.set('clipRect', {top:0,left:0,width:1280,height:900}, function(){
					//OPEN PAGE
					page.open(pageUrl, function(status) {
						//WAIT 15 SECS FOR WEBPAGE TO BE COMPLETELY LOADED
						setTimeout(function(){
							page.render('screenshot.pdf', {format:'pdf', quality:'100'}, function(finished){
								console.log('rendering '+pageUrl+' done');
								ph.exit();
							});
						}, 15000);
					});
					//END OF: OPEN PAGE
				});
			});
			//END OF: CREATE PAGE OBJECT
		});
	});
}
