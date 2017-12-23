/* ------------------vars-------------- */
var images = ["img/scene1.jpg", "img/scene2.jpg", "img/scene3.jpg", "img/scene4.jpg", "img/scene5.jpg", ]




/*------------functions------------ */
$(document).ready(function() {
    var index = Math.floor(Math.random() * 5);
    $("img#scenery_img").attr('src', images[index]);
    $("img#scenery_img").click(function() {
        $(this).attr('src', images[Math.floor(Math.random() * 5)]);
    });

});
