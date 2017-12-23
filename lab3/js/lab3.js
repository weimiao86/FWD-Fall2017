/******* vars ***********/
var slides = ["img/special1.jpg", "img/special2.jpg", "img/special3.jpg"];
var count = 0;
var shopping_list = "";


/********** functions **********/
$(document).ready(function() {
    setInterval(switchImage, 3000);
    $("div.shopping_gallery").hover(redDesc, blackDesc);
    $("div.shopping_gallery").click(select);
    $('ul').on('mousedown', "li.listItem", preDelete);
    $('ul').on('mouseup', "li.listItem", deleteItem);
    $("input[type='button'][name='generateList']").click(generateshoopingList);
});

function switchImage() {
    $("#specialOffer_img").animate({
        opacity: 0.0
    }, 500, function() {
        if (count < 2) {
            count++;
        } else {
            count = 0;
        }
        $("#specialOffer_img").attr("src", slides[count]).animate({
            opacity: 1.0
        }, 500);
    });
}

function redDesc() {
    $(this).find('p').css("color", "red");
}

function blackDesc() {
    $(this).find('p').css("color", "black");
}

function select() {
    var selectedItem = $(this).children(':last').text();
    var cartFirst = $('ul#shoppingList > li:first').text();
    if (cartFirst == "Empty") {
        $('ul#shoppingList > li:first').text(String(selectedItem));
        shopping_list += String(selectedItem) + "<br>";
    } else {
        if ($("li:contains(" + String(selectedItem) + ")").length) {
            $("li:contains(" + String(selectedItem) + ")").fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
        } else {
            $('ul#shoppingList').append('<li class="listItem">' + selectedItem + '</li>');
            shopping_list += String(selectedItem) + "<br>";
        }
    }
}

function preDelete() {
    $(this).animate({
        "padding-left": 100,
        opacity: 0.5
    }, 500);
}

function deleteItem() {
    shopping_list = shopping_list.replace(String($(this).text()) + "<br>", "");
    console.log("this:" + String($(this).text()));
    console.log(shopping_list);
    $(this).remove();
}

function generateshoopingList() {
    $("div#generated_list >p").text("");
    console.log("btn clicked");
    $("div#generated_list >p").append(shopping_list);

}
