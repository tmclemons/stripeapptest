
var submitCus = function(){
  $('#subscribe-form').click(
      $.ajax({
          'type':'GET',
          'url':'/partials/subscriptions'
      })
  );
}
