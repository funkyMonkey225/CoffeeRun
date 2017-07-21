// GET / POST to API with AJAX
var $coffeeForm = $('[data-coffee-order="form"]');
var $order = $('[data-role="order"]');
var $email = $('[data-role="email"]');
var $size = $('[data-role="size"]')
var $flavor = $('[data-role="flavor"]');
var $strength = $('[data-role="strength"]');
var $displayDiv = $('[data-draw="display"]');

var URL = 'http://dc-coffeerun.herokuapp.com/api/coffeeorders';
var order = {};
var priorOrders;
var parsedOrders;

function storeValue(name) {
    order[name.attr('name')] = name.val();
}

function getSize() {
    var size = $('input[data-role=size]:checked').val();
    order[$size.attr('name')] = size;
}

function getFlavor() {
    var flavor = $flavor.find(":selected").text();
    order[$flavor.attr('name')] = flavor;
}

function getStrength() {
    var strength = $strength.val();
    order[$strength.attr('name')] = strength;
}

// 
// function setDefaults() {
//     var flavorValue = (localStorage.getItem('flavor')).toLowerCase();
//     $order.val(localStorage.getItem('order'));
//     $email.val(localStorage.getItem('email'));
//     $('input[data-role=size]:checked').val('size');
//     $('input:radio[data-role=size]').filter('[value=' + localStorage.getItem('size') + ']').prop('checked', true);
//     $flavor.find('option[value=' + flavorValue + ']').prop('selected', true);
//     $('[data-role="strength"]').val(localStorage.getItem('strength'));
// }

function getServerData() {
    $.get(URL, storeData);
} 
    
function storeData(orders) {
    localStorage.setItem('priorOrders', JSON.stringify(orders));
    parseData();
}

function parseData() {
    parsedOrders = JSON.parse(priorOrders);
}

function sendDataToServer() {
    $.post(URL, order, function (resp) {
        console.log(resp);
    });
}

function coffeeStrengthRating (strength) { 
    if (strength === 0) {
        return "Decaf";
    } else if (strength <= 25) {
        return "Lite";
    } else if (strength <= 50) {
        return "Medium";
    } else if (strength <= 75) {
        return "Strong";
    } else {
        return "Very strong";
    }
}

function drawOrders() {
    var emails = Object.keys(parsedOrders);
    var ordersArray = emails.map(function (email) {
        var data = parsedOrders[email];
        return data;
    })

    ordersArray.forEach(function(order1, i) {
        var strengthRate = coffeeStrengthRating(ordersArray['strength'])
        var $orderPrint = $('<p></p>', {
            'text': order1['email'] + ": " + strengthRate + ordersArray['size'] + ordersArray['flavor'] + ordersArray['order'],
            'class': 'display-order',
            'data-draw': 'order', 
        });
        $displayDiv.append($orderPrint);
    });
}



// setDefaults();

drawOrders();

$coffeeForm.submit(function (event) {
  event.preventDefault();
  storeValue($order);
  storeValue($email);
  getSize();
  getFlavor();
  getStrength();
  sendDataToServer();
  getServerData();
});
