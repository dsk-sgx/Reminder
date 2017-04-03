$(function () {
    var list = $('#list');
    var menuBtn = $('#list_open');
    var content = $('#content');

    menuBtn.on('click', function() {
      $('#content').toggleClass('list_open');
      $('#list').toggleClass('close')
    });
});
