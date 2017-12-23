/////////////////var////////////////
var news_category = "";
var news_language = "";
var news_country = "";
var news_source = "";


///////////////function//////////

$(document).ready(function() {
  requestSource();
  $("select#category_selection").change(function() {
    news_category = String($(this).find(':selected').val());
    console.log(news_category);
    requestSource();
  });
  $("select#lang_selection").change(function() {
    news_language = String($(this).find(':selected').val());
    console.log(news_language);
    requestSource();
  });
  $("select#country_selection").change(function() {
    news_country = String($(this).find(':selected').val());
    console.log(news_country);
    requestSource();
  });
  $("select#source_selection").change(function() {
    news_source = String($(this).find(':selected').val());
    console.log(news_source);
  });
  $("#show_news").click(requestNews);
});

function requestSource() {
  var parameters = {
    category: news_category,
    language: news_language,
    country: news_country,
    apiKey: '90e1f562242e4de9a2751845e5e51f22'
  }
  var url = ' https://newsapi.org/v1/sources?';
  $.getJSON(url, parameters, showSources);
}

function showSources(response) {
  console.log("sources loaded");
  var result_status = response.status;
  if (result_status != "ok") {
    console.log("Faild to load news sources");
    return;
  }
  var result_items = response.sources;
  if (result_items.length == 0) {
    alert("No news source found  with the current filter, please try a different filter.");
  }
  $("select#source_selection").empty();
  $("select#source_selection").append("<option value= '' disabled selected hidden>" + "News Sources" + "</option>");
  $.each(result_items, function(i, sources) {
    var updateSource = sources.name;
    var newValue = updateSource.replace(/\s+/g, '-').replace(/\(|\)+/g, '');
    console.log(updateSource);
    $("select#source_selection").append($('<option>', {
      value: newValue,
      text: updateSource
    }));
  });
}

function requestNews() {
  var parameters = {
    source: news_source,
    apiKey: '90e1f562242e4de9a2751845e5e51f22'
  }
  var url = ' https://newsapi.org/v1/articles?';
  $.getJSON(url, parameters, showNews);
}

function showNews(response) {
  //console.log("news loaded");
  var result_status = response.status;
  if (result_status != "ok") {
    console.log("Faild to load news articles");
    return;
  }
  var result_items = response.articles;
  $("div#news_section").empty();
  $.each(result_items, function(i, articles) {
    var news_title = articles.title;
    var news_description = articles.description;
    var news_url = articles.url;
    var news_imgurl = articles.urlToImage;
    //console.log(news_title);
    var h2_title = "<h2>" + "<a href=" + news_url + " target='_blank'>" + news_title + "</a>" + "</h2>";
    var p_description = "<p>" + news_description + "</p>";
    var news_img = "<img src=" + news_imgurl + ">";
    $("div#news_section").append(h2_title, news_img, p_description);
  });
}
