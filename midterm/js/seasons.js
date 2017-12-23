/* ------------------vars-------------- */





/*------------functions------------ */
$(document).ready(function() {
    $("ul.season_text").hide();
    $("h2#spring").click(function() {
        $("ul#srping_list").slideToggle(500, "swing");
    });
    $("h2#summer").click(function() {
        $("ul#summer_list").slideToggle(500, "swing");
    });
    $("h2#fall").click(function() {
        $("ul#fall_list").slideToggle(500, "swing");
    });
    $("h2#winter").click(function() {
        $("ul#winter_list").slideToggle(500, "swing");
    });
});
