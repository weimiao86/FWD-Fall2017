/*********vars *********/
var cause_slide = ["img/waterPollution1.jpg", "img/waterPollution2.jpg", "img/waterPollution3.jpg", "img/waterPollution4.jpg", "img/waterPollution5.jpg", "img/waterPollution6.jpg", "img/waterPollution7.jpg", ];
var count = 0;
var region = "asia";
var gallon = 0;
var asia_avg = 32;
var africa_avg = 23;
var northA_ave = 162;
var sounthA_avg = 72;
var europe_avg = 64;
var oceania_avg = 162;


/********functions*******/
$(document).ready(function() {
    setInterval(showCauses, 3000);
    $('img.content_imgs').click(modalImg);
    $('span.close').click(closeModal);
    $('img#modal_img').click(closeModal);
    $('ul#nav_list').find('a').click(function(e) {
        e.preventDefault();
        var section = $(this).attr("href");
        //console.log(section);
        $("html, body").animate({
            scrollTop: $(section).offset().top - 60
        }, 'slow');
    });
    $("div#scroll_list").find('a').click(function(e) {
        e.preventDefault();
        $(this).addClass('activeItem');
        $(this).siblings().removeClass('activeItem');
        var imgsrc = $(this).attr("href");
        $("img#virtual_water_img").attr('src', imgsrc);
    });
    $("select#region").change(function() {
        region = String($(this).find(':selected').val());
        //console.log(region);
    });
    $("form#water_input").submit(function(e) {
        e.preventDefault();
        water_cost_avg();
    });
    $("h4#kitchen_h4").click(function() {
        $("div#kitchen_tips").slideToggle(1500, "swing");
    });
    $("h4#bath_h4").click(function() {
        $("div#bathroom_tips").slideToggle(1500, "swing");
    });
    $("h4#outdoor_h4").click(function() {
        $("div#outdoor_tips").slideToggle(1500, "swing");
    });
    $("h4#office_h4").click(function() {
        $("div#office_tips").slideToggle(1500, "swing");
    });


});

$(window).scroll(function() {
    if ($(window).scrollTop() > 210) {
        $('nav').addClass('nav_fixed');
    }
    if ($(window).scrollTop() < 211) {
        $('nav').removeClass('nav_fixed');
    }
});

$(window).scroll(highlightNav);


function modalImg() {
    var imgSrc = this.src;
    var desc = String(this.alt);
    $('div.modal').show();
    $('img#modal_img').attr("src", imgSrc);
    $("div#caption").text(desc);
}

function closeModal() {
    $('div.modal').hide();
}

function highlightNav() {
    var h_overview = $('h2#overview');
    var h_causes = $('h2#causes');
    var h_relevance = $('h2#relevance');
    var h_save = $('h2#save');
    var h2_1 = h_overview.offset().top - $(window).scrollTop();
    var h2_2 = h_causes.offset().top - $(window).scrollTop();
    var h2_3 = h_relevance.offset().top - $(window).scrollTop();
    var h2_4 = h_save.offset().top - $(window).scrollTop();

    if (h2_1 < $(window).height() / 2) {
        $('li#nav_overview').addClass('active');
    } else {
        $('li#nav_overview').removeClass('active');
    }
    if (h2_2 < $(window).height() / 2) {
        $('li#nav_causes').addClass('active');
    } else {
        $('li#nav_causes').removeClass('active');
    }
    if (h2_3 < $(window).height() / 2) {
        $('li#nav_relevance').addClass('active');
    } else {
        $('li#nav_relevance').removeClass('active');
    }
    if (h2_4 < $(window).height() / 2) {
        $('li#nav_save').addClass('active');
    } else {
        $('li#nav_save').removeClass('active');
    }
}

function showCauses() {
    $('img#causes_gallery').animate({
        opacity: 0.5,
        marginLeft: "-1600px"
    }, 'slow', function() {
        if (count < (cause_slide.length - 1)) {
            count++;
        } else {
            count = 0;
        }
        $('img#causes_gallery').css("margin", "auto");
        $('img#causes_gallery').attr('src', cause_slide[count]).animate({
            opacity: 1.0
        }, 'slow');
    })
}


function water_cost_avg() {
    gallon = $("input[type='number'][name='gallons']").val();
    var text = "";
    if (region == "asia") {
        if (gallon > asia_avg) {
            $("img#goodtobad").attr('src', "img/normal.png");
            text = "The average daily water consumption per person in Asia region is 32 Gallon, You are over the average line!"
            $("p#waterResult").text(text);
        } else {
            $("img#goodtobad").attr('src', "img/good.png");
            text = "The average daily water consumption per person in Asia region is 32 Gallon, You are below the average line!"
            $("p#waterResult").text(text);
        }
    }
    if (region == "africa") {
        if (gallon > africa_avg) {
            $("img#goodtobad").attr('src', "img/normal.png");
            text = "The average daily water consumption per person in Africa region is 23 Gallon, You are over the average line!"
            $("p#waterResult").text(text);
        } else {
            $("img#goodtobad").attr('src', "img/good.png");
            text = "The average daily water consumption per person in Africa region is 23 Gallon, You are below the average line!"
            $("p#waterResult").text(text);
        }
    }
    if (region == "europe") {
        if (gallon > europe_avg) {
            $("img#goodtobad").attr('src', "img/normal.png");
            text = "The average daily water consumption per person in Europe region is 64 Gallon, You are over the average line!"
            $("p#waterResult").text(text);
        } else {
            $("img#goodtobad").attr('src', "img/good.png");
            text = "The average daily water consumption per person in Europe region is 64 Gallon, You are below the average line!"
            $("p#waterResult").text(text);
        }
    }
    if (region == "northA") {
        if (gallon > northA_ave) {
            $("img#goodtobad").attr('src', "img/normal.png");
            text = "The average daily water consumption per person in North America region is 162 Gallon, You are over the average line!"
            $("p#waterResult").text(text);
        } else {
            $("img#goodtobad").attr('src', "img/good.png");
            text = "The average daily water consumption per person in North America region is 162 Gallon, You are below the average line!"
            $("p#waterResult").text(text);
        }
    }
    if (region == "southA") {
        if (gallon > sounthA_avg) {
            $("img#goodtobad").attr('src', "img/normal.png");
            text = "The average daily water consumption per person in South America region is 72 Gallon, You are over the average line!"
            $("p#waterResult").text(text);
        } else {
            $("img#goodtobad").attr('src', "img/good.png");
            text = "The average daily water consumption per person in South America region is 72 Gallon, You are below the average line!"
            $("p#waterResult").text(text);
        }
    }
    if (region == "oceania") {
        if (gallon > oceania_avg) {
            $("img#goodtobad").attr('src', "img/normal.png");
            text = "The average daily water consumption per person in Oceania region is 162 Gallon, You are over the average line!"
            $("p#waterResult").text(text);
        } else {
            $("img#goodtobad").attr('src', "img/good.png");
            text = "The average daily water consumption per person in Oceania region is 162 Gallon, You are below the average line!"
            $("p#waterResult").text(text);
        }
    }
}
