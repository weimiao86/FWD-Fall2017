/* ------------------vars-------------- */

var actText = "";



/*------------functions------------ */
$(document).ready(function() {
    $("div#act_content").hide();
    $("img#act1").click(function() {
        $("div#act_content").show();
        $("img#act_img").attr('src', "img/climbing.jpg");
        actText = "Colorado offers breathtaking vistas of some of the Rocky’s most scenic peaks and a rich history that make Colorado one of the most visited summer climbing areas in North America.";
        $("p#act_text").text(actText);
    });
    $("img#act2").click(function() {
        $("div#act_content").show();
        $("img#act_img").attr('src', "img/skiing.jpg");
        actText = "From family ski trips with leisurely days spent gliding down the slopes to intense, expert-only terrain for adventurous skiers and boarders, there’s a slope in Colorado for everyone.";
        $("p#act_text").text(actText);
    });
    $("img#act3").click(function() {
        $("div#act_content").show();
        $("img#act_img").attr('src', "img/cycling.jpg");
        actText = "Some of the best single-track trails on the planet are found in Colorado. Many Colorado roads offer road cyclists a great way to enjoy the spectacular scenery outside of a car. The plethora of bike paths offer families the opportunity for fun cycling adventures.";
        $("p#act_text").text(actText);
    });
});
