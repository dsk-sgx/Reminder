$(function () {
    var menu = $('#slide_menu');
    var menuBtn = $('#btn_show_items');
    var body = $('#content_whole');
    var layer = $('.layer');
    var menuWidth = menu.outerWidth();

    menuBtn.on('click', function() {
        body.toggleClass('open');

        if (body.hasClass('open')) {
            $('.layer').show();
            body.animate({'left': menuWidth}, 300);
            menu.animate({'left': 0}, 300);
        } else {
            $('.layer').hide();
            menu.animate({'left': -menuWidth}, 300);
            body.animate({'left': 0}, 300);
        }
    });


    layer.on('click', function () {
        menu.animate({'left': -menuWidth}, 300);
        body.animate({'left': 0}, 300).removeClass('open');
        layer.hide();

    });

});