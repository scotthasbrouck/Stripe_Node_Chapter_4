$(function() {
  Stripe.setPublishableKey('pk_test_kj6N1EAvgGa9zUq9TwmhT6LO');
  $('form').submit(function(event) {
    var form = $(this);
	form.find('.submit').attr('disabled', true);
	Stripe.createToken(this, function(status, response) {
	  if (response.error) {
          form.find('.submit').attr('disabled', false);
          $('.error_message').html(response.error.message);
      }
	  else {
        $('<input>').attr({
          type: 'hidden',
          value: response.id,
          name: 'stripeToken'
        }).appendTo(form);
        form.get(0).submit();
      }
    });
    event.preventDefault();
  });
});
