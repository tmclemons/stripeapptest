
var stripeCustomerResponseHandler = function(status, response) {
var $form = $('#customer-form');
  if (response.error) {
    // Show the errors on the form
    $form.find('.customer-errors').text(response.error.message);
    $form.find('button').prop('disabled', false);
  } else {
    // token contains id, last4, and card type
    var token = response.id;
    // Insert the token into the form so it gets submitted to the server
    $form.append($('<input type="hidden" name="stripeToken" />').val(token));
    // and re-submit
    $form.get(0).submit();
  }
};

jQuery(function($) {
  $('#customer-form').submit(function(e) {
    var $form = $(this);
    // Disable the submit button to prevent repeated clicks
    $form.find('button').prop('disabled', true);
    Stripe.card.createToken($form, stripeCustomerResponseHandler);
    // Prevent the form from submitting with the default action
    return false;
  });
});
