// GET / POST to API with AJAX
var $coffeeForm = $('[data-coffee-order="form"]');
var $order = $('[data-role="order"]');
var $email = $('[data-role="email"]');
var $size = $('[data-role="size"]')
var $flavor = $('[data-role="flavor"]');
var $strength = $('[data-role="strength"]');
var $displayDiv = $('[data-draw="display"]');
var $myOrderDiv = $('[data-draw="my-order"]');
var $emailSearch = $('[data-role="email-search-form"]');

var URL = 'http://dc-coffeerun.herokuapp.com/api/coffeeorders';
var order = {};
var priorOrders;
var parsedOrders;

function storeValue(name, title) {
    order[name.attr('name')] = name.val();
    localStorage.setItem(title, name.val());
}

function getSize() {
    var size = $('input[data-role=size]:checked').val();
    order[$size.attr('name')] = size;
    localStorage.setItem('size', size);
}

function getFlavor() {
    var flavor = $flavor.find(":selected").text();
    order[$flavor.attr('name')] = flavor;
    localStorage.setItem('flavor', flavor);
}

function getStrength() {
    var strength = $strength.val();
    order[$strength.attr('name')] = strength;
    localStorage.setItem('strength', strength);
}


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
}

function sendDataToServer() {
    $.post(URL, order, function (resp) {
        console.log(resp);
    });
}

function coffeeStrengthRating (strength) { 
    if (strength === 0) {
        return "Decaf";
    } else if (strength <= 20) {
        return "Very lite";
    } else if (strength <= 40) {
        return "Lite";
    } else if (strength <= 60) {
        return "Medium strength";
    } else if (strength <= 80) {
        return "Strong";
    } else {
        return "Very strong";
    }
}

function filterUndefined(element) {
    if (element === undefined || element === "None") {
        return "";
    } else {
        return (element.toLowerCase() + " ");
    }
}

function drawOrders() {
    var parsedOrders = JSON.parse(localStorage.getItem('priorOrders'));
    var emails = Object.keys(parsedOrders);
    var ordersArray = emails.map(function (email) {
        var data = parsedOrders[email];
        return data;
    })
    var $subtitle = $('<h2></h2>', {
        'text': "Past Coffee Orders",
        'class': 'subtitle'
    });
    $displayDiv.append($subtitle);
    ordersArray.forEach(function(order1, i) {
        var strengthRate = coffeeStrengthRating(ordersArray[i]['strength'])
        var $orderPrint = $('<p></p>', {
            'text': ordersArray[i]['emailAddress'] + ": " + strengthRate + " " + filterUndefined(ordersArray[i]['size']) + filterUndefined(ordersArray[i]['flavor']) + ordersArray[i]['coffee'],
            'class': 'display-order',
            'data-draw': 'order', 
        });
        $displayDiv.append($orderPrint);
    });
}

function drawEmailSearch() {
    var $search = $('<input>', {
        'class': 'form-control',
        'type': 'email',
        'name': 'emailSearch',
        'data-role': 'email-search',
        'placeholder': 'Enter your email.'
    });
    $emailSearch.append($search);
    var $submitBtn = $('<button></button>', {
        'type': 'submit',
        'class': 'btn btn-default',
        'text': 'Search'
    })
    $emailSearch.append($submitBtn);
}


function showPastOrders() {
    var action = 1;
    $('[data-role="past-orders-button"]').on('click', function (event) {
        event.preventDefault();
        if (action === 1) {
            $displayDiv.show();
            drawOrders();
            $('[data-role="past-orders-button"]').text("Hide Past Orders");
            action = 2;
        } else if (action === 2) {
            $displayDiv.hide();
            $('[data-role="past-orders-button"]').text("Show Past Orders");
            action = 3;
        } else {
            $displayDiv.show();
            $('[data-role="past-orders-button"]').text("Hide Past Orders");
            action = 2;
        }
    });
}

function searchByEmail() {
    var action = 1;
    $('[data-role="email-button"]').on('click', function (event) {
        event.preventDefault();
        if (action === 1) {
            $emailSearch.show();
            drawEmailSearch();
            $('[data-role="email-button"]').text("Hide My Order");
            action = 2;
        } else if (action === 2) {
            $emailSearch.hide();
            $('[data-role="email-button"]').text("Search by Email");
            action = 3;
        } else {
            $emailSearch.show();
            $('[data-role="email-button"]').text("Hide My Order");
            action = 2;
        }
    });
}

$emailSearch.submit(function (event) {
    event.preventDefault();
    var searchedEmail = $('[data-role="email-search"]').val();
    var parsedOrders = JSON.parse(localStorage.getItem('priorOrders'));
    var $subtitle = $('<h2></h2>', {
        'text': "My Order",
        'class': 'subtitle'
    });
    $myOrderDiv.append($subtitle);
    var strengthRate = coffeeStrengthRating(parsedOrders[searchedEmail]['strength']);
    var $searchedOrder = $('<p></p>', {
        'text': "Strength: " + strengthRate + "\nSize: " + parsedOrders[searchedEmail]['size'] + "\nFlavor: " + parsedOrders[searchedEmail]['flavor'] + "\nType: " + parsedOrders[searchedEmail]['coffee']
    })
    $myOrderDiv.append($searchedOrder);
})

// setDefaults();

getServerData();
showPastOrders();
searchByEmail();

$coffeeForm.submit(function (event) {
  event.preventDefault();
  storeValue($order, 'order');
  storeValue($email, 'email');
  getSize();
  getFlavor();
  getStrength();
  sendDataToServer();
  getServerData();
});
