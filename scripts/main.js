var $coffeeForm = $('[data-coffee-order="form"]');
var $order = $('[data-role="order"]');
var $email = $('[data-role="email"]');


function storeValue(name, title) {
    localStorage.setItem(title, name.val());
}

function getSize() {
    var size = $('input[data-role=size]:checked').val();
    localStorage.setItem('size', size);
}

function getFlavor() {
    var flavor = $('[data-role="flavor"]').find(":selected").text();
    localStorage.setItem('flavor', flavor);
}

function getStrength() {
    var strength = $('[data-role="strength"]').val();
    localStorage.setItem('strength', strength);
}

function setDefaults() {
    $order.val(localStorage.getItem('order'));
    $email.val(localStorage.getItem('email'));
    $('input[data-role=size]:checked').val('size');
    // $('[data-role="flavor"]').find(":selected").text();

}


$coffeeForm.submit(function (event) {
  event.preventDefault();
  storeValue($order, 'order');
  storeValue($email, 'email');
  getSize();
  getFlavor();
  getStrength();
});

setDefaults();