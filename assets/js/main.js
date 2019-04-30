$(function() {
    $("h2").each(function(index){
        var navContentChildId = "navContentChildId" + index;
        $(this).attr("id", navContentChildId);
        $("nav ul").append("<li><a href='#" + navContentChildId + "'>" + $(this).text() + "</a></li>");
    });
    $("nav ul li:first-child a").addClass("active");
    $("nav ul li a").click(function() {
        var position = $($(this).attr("href")).offset().top - 80;
        $("html, body").animate({scrollTop: position}, 400);
        $("nav ul li a").removeClass("active");
        $(this).addClass("active");
    });
});