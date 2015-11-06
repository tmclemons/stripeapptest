var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var stripe = require("stripe")("sk_test_r18fvc3LgDlo6uKRCxnsi5Oj");
var cusObject = "cus_7HLWwJz9DIJrqF";

/* GET home page. */
router.get('/', function(req, res, next ) {
  res.render('index', {title:'express'});
    // res.sendFile('index');
});

// sample charge
router.post('/charge', function(req, res, next) {
  var stripeToken = req.body.stripeToken;

  var charge = stripe.charges.create({
    amount: 1000, // amount in cents, again
    currency: "usd",
    source: stripeToken,
    description: "Example charge"
  }, function(err, charge) {
    if (err && err.type === 'StripeCardError') {
      // The card has been decline
    } else {
      res.redirect('/');
    }
  });
});

// create customer
router.post('/customers', function(req, res, next) {
  var stripeToken = req.body.stripeToken;

  var customers = stripe.customers.create({
    source: stripeToken,
    description: "Example Customer"
  }, function(err, charge) {
    if (err && err.type === 'StripeCardError') {
      // The card has been decline
    } else {
      res.redirect('/');
    }
  });
});

// add subscription
router.post('/plans', function(req, res, next) {
  var stripeToken = req.body.stripeToken;
  var quantity = req.body.quantity;

  var subscription = stripe.customers.createSubscription(
    cusObject, {
    plan: "sift-introductory",
    quantity: quantity
    }, function(err, charge) {
      if (err && err.type === 'StripeCardError') {
        // The card has been decline
      } else {
        res.redirect('/');
      }
  });
});

// retrieve customer data
router.get('/profile/customer', function(req, res, next) {
  var count = 0;
  var cusResponse;
  var subResponse;
  var ccResponse;

  stripe.customers.retrieve(
    cusObject,
    function(err, result) {
      if (err && err.type === 'StripeCardError') {
        // The card has been decline
      } else {
        count++;
        cusResponse = result;
        ccResponse = result.sources.data;
      }
  });

  stripe.customers.listSubscriptions(
    cusObject,
    function(err, subscriptions) {
      if (err && err.type === 'StripeCardError') {
        // The card has been decline
      } else {
        count++;
        subResponse = subscriptions.data;
        if(count == 2){
          res.render('profile', {
            customer: cusResponse,
            sources: ccResponse,
            subscribes: subResponse
          });
        }
      }
    });
});

//update customer subscription
router.post('/profile/update-subs', function(req, res, next){
  var customerObj = cusObject;
  var subscriptionID = req.body.subID;
  var quantity = req.body.subQuantity;

  for (var i = 0; i < req.body.subTotal; i++) {
    updateSubs(subscriptionID[i], quantity[i]);
  }

  res.redirect('/profile/customer');

  // function(err, subscription) {
  //   if (err && err.type === 'StripeCardError') {
  //        // The card has been decline
  //      } else {
  //        if(count == req.body.subTotal)
  //        res.redirect('/profile/customer');
  //      }
  // }
});

// update subscription info
function updateSubs(subscriptionID, quantity) {
  // var subscriptID = JSON.stringify(subscriptionID);
  // var customerObjStr = "'"+customerObj+"'";

  stripe.customers.updateSubscription(
    'cus_7HLWwJz9DIJrqF',
    subscriptionID,
    {
      plan:'sift-introductory',
      quantity: quantity
    },
    function(err, subscriptions) {

    });
}

//update customer info
router.post('/profile/cus-info', function(req, res, next){
  stripe;
  var customerObj = [cusObject];
  var cusCCId = req.body.ccID;
  var ccQuantity = req.body.ccQuantity;
  var resultsCC;
  var cusCreditCard;

  for (var i = 0; i < ccQuantity; i++) {
    resultsCC = {
      address_line1: req.body.address1[i],
      address_line2: req.body.address2[i],
      address_city: req.body.city[i],
      address_country: req.body.country[i],
      address_state: req.body.state[i],
      address_zip: req.body.zip[i],
      exp_month: req.body.expMonth[i],
      exp_year: req.body.expYear[i],
      name: req.body.cusName
    };
    updateCusInfo(req);
    updateCCInfo(cusCCId[i], resultsCC, req);
  }
  res.redirect('/profile/customer');
});

function updateCusInfo(req){

  stripe.customers.update(
    cusObject,
    {
    description: req.body.cusName,
    email: req.body.cusEmail
  }, function(err, customer) {
    // asynchronously called
    // console.log('Fail')

  });
}

function updateCCInfo(cusCCId, resultsCC, req){
  stripe.customers.updateCard(
    cusObject,
    cusCCId,
    resultsCC,
    function(err, customer) {
    // asynchronously called
    console.log(cusCCId)
    console.log(resultsCC)

    console.log('check')
  });
}

router.get('/profile/invoices', function(req, res, next){
  stripe;
  var cusInvoice;
  stripe.invoices.list(
    { limit: 30,
      customer: cusObject
     },
    function(err, invoices) {
      // asynchronously called
      if (err && err.type === 'StripeCardError') {
        // The card has been decline
      } else {
        cusInvoice = invoices.data;
        console.log(cusInvoice)
        // console.log(cusInvoice)
        res.render('invoice', {
          invoices: cusInvoice
        });
      }
    });
});

router.get('/profile/invoice/invoice-item', function(req, res, next){
  stripe;
  // var invoiceID = req.body.invoiceID;
  // console.log(req.body.invoiceID)
  stripe.invoices.retrieveLines(
    invoiceID,
    { limit: 30
     },
    function(err, lines) {
      // asynchronously called
      console.log(lines.total_count )
      if (err && err.type === 'StripeCardError') {
        // The card has been decline
      } else {
        // console.log(lines)
        // res.json('invoice-item', lines)
      }
    });
});

module.exports = router;
