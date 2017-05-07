$(function () {
    var list = $('#list');
    var menuBtn = $('#list_open');
    var content = $('#content');

    var isOpen = $('#content').hasClass('list_open');
    menuBtn.on('click', function() {
      if (isOpen) {
        $('#content').removeClass('list_open');
        $('#list').removeClass('close');
      } else {
        $('#content').addClass('list_open');
        $('#list').addClass('close');
      }
      isOpen = !isOpen;
    });
});
