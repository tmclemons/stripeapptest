var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

/* GET home page. */
router.get('/', function(req, res, next ) {
  res.render('index', {title:'express'});
    // res.sendFile('index');
});

router.post('/charge', function(req, res, next) {
  var stripe = require("stripe")("sk_test_r18fvc3LgDlo6uKRCxnsi5Oj");

  // (Assuming you're using express - expressjs.com)
  // Get the credit card details submitted by the form
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

router.post('/customers', function(req, res, next) {
  var stripe = require("stripe")("sk_test_r18fvc3LgDlo6uKRCxnsi5Oj");

  // (Assuming you're using express - expressjs.com)
  // Get the credit card details submitted by the form
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

router.post('/plans', function(req, res, next) {
  var stripe = require("stripe")("sk_test_r18fvc3LgDlo6uKRCxnsi5Oj");

  // (Assuming you're using express - expressjs.com)
  // Get the credit card details submitted by the form
  var stripeToken = req.body.stripeToken;
  var quantity = req.body.quantity;

  var subscription = stripe.customers.createSubscription(
    "cus_7HLWwJz9DIJrqF", {
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
  var stripe = require("stripe")("sk_test_r18fvc3LgDlo6uKRCxnsi5Oj");
  var count = 0;
  var cusResponse;
  var subResponse;
  var ccResponse;

  stripe.customers.retrieve(
    "cus_7HLWwJz9DIJrqF",
    function(err, result) {
      if (err && err.type === 'StripeCardError') {
        // The card has been decline
      } else {
        // console.log(result);
        // console.log(Object.keys(result.subscriptions.data));
        // res.render('profile', result);
        // console.log('hit')
        count++;
        // console.log(count)
        // return result
        cusResponse = result;
        ccResponse = result.sources.data;
      }
  });

  stripe.customers.listSubscriptions(
    "cus_7HLWwJz9DIJrqF",
    function(err, subscriptions) {
      if (err && err.type === 'StripeCardError') {
        // The card has been decline
      } else {
        // console.log(subscriptions);
        // console.log(subscriptions.data);
        // res.render('profile', subscriptions);
        // console.log('hit2')
        count++;
        // console.log(count)
        // return subscriptions
        subResponse = subscriptions.data;
        console.log(count)
        if(count == 2){
          console.log(ccResponse)
          // console.log(subResponse)
          res.render('profile', {
            customer: cusResponse,
            sources: ccResponse,
            subscribes: subResponse
          });
        }
      }
    });
});


module.exports = router;
