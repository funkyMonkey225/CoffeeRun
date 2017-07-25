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

function getFormValues() {
    storeValue($order, 'order');
    storeValue($email, 'email');
    getSize();
    getFlavor();
    getStrength();
}

function setDefaults() {
    var flavorValue = (localStorage.getItem('flavor')).toLowerCase();
    $order.val(localStorage.getItem('order'));
    $email.val(localStorage.getItem('email'));
    $('input[data-role=size]:checked').val('size');
    $('input:radio[data-role=size]').filter('[value=' + localStorage.getItem('size') + ']').prop('checked', true);
    $flavor.find('option[value=' + flavorValue + ']').prop('selected', true);
    $('[data-role="strength"]').val(localStorage.getItem('strength'));
}

function getServerData() {
    var req = $.get(URL);
    req
        .then(storeData)
        .then(drawOrders);
} 
    
function storeData(orders) {
    localStorage.setItem('priorOrders', JSON.stringify(orders));
}

function sendDataToServer() {
    var req = $.post(URL, order);
    req.then(getServerData);
}

function deleteOrder(email) {
    var req = $.ajax ({
        url: URL + '/' + email.attr('name'),
        method: "DELETE"
    });
    req
        .then(function() {
            removeOrderListing(email);
        });
}

function removeOrderListing(element) {
    element.remove();
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

function filterUndefined2(element) {
    if (element === undefined || element === "None") {
        return "Not specified";
    } else {
        return capitalizeFirstLetter(element);
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function drawOrders() {
    if ($('[data-draw="past-orders"]').children()) {
        $('[data-draw="past-orders"]').remove();
    }
    parsedOrders = JSON.parse(localStorage.getItem('priorOrders'));
    var emails = Object.keys(parsedOrders);
    var ordersArray = emails.map(function (email) {
        var data = parsedOrders[email];
        return data;
    })
    var $pastOrders = $('<div></div>', {
        'class': 'display-order',
        'data-draw': 'past-orders'
    });
    ordersArray.forEach(function(order1, i) {
        var strengthRate = coffeeStrengthRating(ordersArray[i]['strength'])
        var $orderPrint = $('<a></a>', {
            'text': ordersArray[i]['emailAddress'] + ": " + strengthRate + " " + filterUndefined(ordersArray[i]['size']) + filterUndefined(ordersArray[i]['flavor']) + ordersArray[i]['coffee'],
            'class': 'display-order',
            'data-draw': 'order', 
            'name': ordersArray[i]['emailAddress']
        });
        $pastOrders.append($orderPrint);
    });
    $displayDiv.append($pastOrders);
}

function drawOrderByEmail(email) {
    var parsedOrders = JSON.parse(localStorage.getItem('priorOrders'));
    var $orderDiv = $('<div></div>', {
        'class': 'individual-orders',
        'data-draw': 'individual-orders'
    });
    var strengthRate = coffeeStrengthRating(parsedOrders[email]['strength']);
    var $searchedOrder = $('<span></span>', {
            'text': "Strength: " + strengthRate
        });
        $orderDiv.append($searchedOrder);
        $orderDiv.append($('<br />'));
    $searchedOrder = $('<span></span>', {
            'text': "Size: " + filterUndefined2(parsedOrders[email]['size'])
        });
        $orderDiv.append($searchedOrder);
        $orderDiv.append($('<br />'));
    $searchedOrder = $('<span></span>', {
            'text': "Flavor: " + filterUndefined2(parsedOrders[email]['flavor'])
        });
        $orderDiv.append($searchedOrder);
        $orderDiv.append($('<br />'));
    $searchedOrder = $('<span></span>', {
            'text': "Type: " + filterUndefined2(parsedOrders[email]['coffee'])
        });
        $orderDiv.append($searchedOrder);
        $orderDiv.append($('<br />'));
    $myOrderDiv.append($orderDiv);
}

function showPastOrders() {
    getServerData();
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
            action = 1;
        }
    });
}

function searchByEmail() {
    var action = 1;
    $('[data-role="email-button"]').on('click', function (event) {
        event.preventDefault();
        if (action === 1) {
            $emailSearch.show();
            $('[data-role="email-button"]').text("Hide Search");
            action = 2;
        } else {
            $emailSearch.hide();
            $myOrderDiv.hide();
            $('[data-role="email-button"]').text("Search by Email");
            action = 1;
        }
    });
}

function addDeleteListener() {
    $('[data-draw="display"]').on('click', $('a'), function(event) {
    event.preventDefault();
    deleteOrder($(event.target));
    })
}

function addEmailSubmitListner() {
    $emailSearch.submit(function (event) {
        event.preventDefault();
        var searchedEmail = $('[data-role="email-search"]').val();
        if ($('[data-draw="individual-orders"]').children()) {
            $('[data-draw="individual-orders"]').empty();
        }
        drawOrderByEmail(searchedEmail);
        $myOrderDiv.show();
    })
}

function addCoffeeFormListener() {
    $coffeeForm.submit(function (event) {
        event.preventDefault();
        getFormValues();
        sendDataToServer();
    });
}

function hideOnLoad() {
    $emailSearch.hide();
    $displayDiv.hide();
    $myOrderDiv.hide();
}

function setListeners() {
    addDeleteListener();
    addEmailSubmitListner();
    searchByEmail();
    showPastOrders();
    addCoffeeFormListener();
}

function main() {
    setDefaults();
    hideOnLoad();
    setListeners();
}

main();
