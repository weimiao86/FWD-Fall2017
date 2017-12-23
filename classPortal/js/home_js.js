
$(document).ready(function(){
  $("#about_me").show();
  $("#labs_container").hide();
  $("#projects_container").hide();
  $("#news_container").hide();

  $('ul#nav_ul li').click(function(e)
    {
     //alert($(this).attr('id'));
     $("#about_nav").removeClass("active");
     $("#labs_nav").removeClass("active");
     $("#projects_nav").removeClass("active");
     $("#news_nav").removeClass("active");
     $(this).addClass("active");

     $("#about_me").hide();
     $("#labs_container").hide();
     $("#projects_container").hide();
     $("#news_container").hide();
     let id=$(this).attr('id');
     switch (id) {
       case "about_nav":
         $("#about_me").show();
         break;
       case "labs_nav":
         $("#labs_container").show();
         break;
       case "projects_nav":
         $("#projects_container").show();
         break;
       case "news_nav":
        $("#news_container").show();
         break;
         default:
           break;
         }
    });
});
