var cartIcon;
var cartInfo;
var cartSum;

function sideChange() {
    cartIcon = document.getElementById("shopping-cart");
    if( $(window).width() >= 768) {
        cartIcon.addEventListener("mouseenter", showShoppingcart);
        cartIcon.addEventListener("mouseleave", hideShoppingcart);        
        cartIcon.removeEventListener("click", showShoppingcart);
    } else {
        cartIcon.addEventListener("click", showShoppingcart);  
        cartIcon.removeEventListener("mouseenter", showShoppingcart);
        cartIcon.removeEventListener("mouseleave", hideShoppingcart);        
    }
}


var showShoppingcart = function(e) {
    cartInfo = document.getElementById("shopping-cart-info");
    /** Check if the cart is opening for mobile view */
    if( $(window).width() < 768) {
        // TODO check if cartIcon contains class show to remove or open
        if (cartInfo.className.split(" ").indexOf('show') == -1) { // for cross browser
            cartInfo.className += " " + 'show';
            cartIcon.className = cartIcon.className.replace(/\bdesktop\b/g, "");
            ajaxCallLoadCart();
        } else {
            // if cartInfo has class show, hide
            hideShoppingcart();
        }
    }

    /** Check if the cart is opening for desktop view */
    if( $(window).width() >= 768) {
        // check if cartIcon has class show 
        if (cartInfo.className.split(" ").indexOf('show') == -1) { // for cross browser
            cartInfo.className += " " + 'show';
            if (cartIcon.className.split(" ").indexOf('desktop') == -1) { // for cross browser
                cartIcon.className += " " + 'desktop';
            }
            ajaxCallLoadCart();
        }
    }
}

// AJAX call
var ajaxCallLoadCart = function() {
    $.ajax({
        url: 'cart/get',
        method: 'GET',
        dataType: 'json',
        cache: true,
        complete: function(data) { loadCartDataToView(data.responseJSON)}
    });
}

// set the var of local cache to cache data from ajax call (for shopping cart loading)
var localCache = {
    /**
     * timeout for cache in millisecond
     * @type {number}
     */
    timeout: 60000,
    /** 
     * @type {{ time }}: number, data: {}}}
     **/
    data: {},
    remove: function (url) {
        delete localCache.data[url];
        window.localStorage.removeItem("cart");
    },
    exist: function (url) {
        return !!JSON.parse(window.localStorage.getItem("cart")) && ((new Date().getTime() - JSON.parse(window.localStorage.getItem("cart")).time) < localCache.timeout);
    },
    get: function (url) {
        console.log('Getting in cache for url' + url);
        return JSON.parse(window.localStorage.getItem("cart")).data;
    },
    set: function (url, cachedData, callback) {
        localCache.remove(url);
        // set to local var
        localCache.data[url] = {
            time: new Date().getTime(),
            data: cachedData
        };
        window.localStorage.setItem("cart", JSON.stringify(localCache.data[url])); 
        if ($.isFunction(callback)) callback(JSON.parse(window.localStorage.getItem("cart")).data);
        // save data to local storage
        window.localStorage.setItem("cart", JSON.stringify(localCache.data[url])); 
    }
};

$.ajaxPrefilter(function (options, originalOptions, jqXHR) {
    if (options.cache) {
        var complete = originalOptions.complete || $.noop,
            url = originalOptions.url;
        //remove jQuery cache as we have our own localCache
        options.cache = false;
        options.beforeSend = function () {
            if (localCache.exist(url)) {
                complete(localCache.get(url));
                console.log('load from local storage')
                return false;
            }            
            return true;
        };
        options.complete = function (data) {
            console.log(data);
            localCache.set(url, data, complete);
            loadCartDataToView(data.responseJSON);
            //console.log(jqXHR.status)
        };
        /*options.success = function(data) {
            loadCartDataToView(data);
        }*/
    }
});

var loadCartDataToView = function(data) {
    cartSum = document.getElementById("cart-sum");
    var table = document.getElementById("info-table");
    table.innerHTML = ""; //empty cart before new load
    var itemsInCart = data.items;
    // console.log(data);
    cartSum.innerHTML = data.totalItems + " item(s) in your cart: <b>&#8364;" + data.totalPrice + "</b>";
    for ( var i = 0; i < itemsInCart.length; i ++ ) {
        var firsttr = document.createElement("tr"),
            secondtr = document.createElement("tr");
        firsttr.className += "product-in-cart";
        secondtr.className += "product-in-cart";
        firsttr.innerHTML = "<td width='30%' rowspan='2' class='product-in-cart-cell-row-2'><img src="+ itemsInCart[i].imgSrc +"></td>" + 
                            "<th width='50%'>" + itemsInCart[i].name + "</th>" +
                            "<td width='20%' rowspan='2' class='product-in-cart-cell-row-2'><i class='fa fa-times'></i></td>";
        secondtr.innerHTML = "<td>" + itemsInCart[i].qty + " <i class='fa fa-times'></i> &#8364;" + itemsInCart[i].price + "</td>";
        table.appendChild(firsttr); 
        table.appendChild(secondtr);
    }
    var tr =  document.createElement("tr");
    tr.className += "checkout-btn";
    tr.innerHTML = "<td colspan='3'><a class='primary-btn'>Checkout</a></td>";
    table.appendChild(tr);
}

var hideShoppingcart = function(e) {
    cartInfo = document.getElementById("shopping-cart-info")
    cartInfo.className = cartInfo.className.replace(/\bshow\b/g, "");
}