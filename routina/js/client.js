var ipc = require('ipc');

console.log('client.js loaded');

//-------------------------------------------------
//
//              Command
//
//-------------------------------------------------
//  main ----> renderer
//
//    refresh
//-------------------------------------------------

// 再描画
ipc.on('refresh', function(tasks) {
  $('#tasks').html('');
  $('#tasks').append($('<ul></ul>'));
  $.each(tasks, function () {
    var task = this.name + ': ' + this.detail;
    $('#tasks ul').append($('<li>'+task+'</li>'));
  });
});

//-------------------------------------------------
//
//              Event
//
//-------------------------------------------------
//  renderer ----> main
//
//   (action)-(target)[-(id)]
//   (action)-(target)[-(id)]-(result)
//
//   action:
//      get, post, patch, delete
//   target:
//      task
//   id:
//      (yet)
//   result:
//      ok, error
//
//-------------------------------------------------

// 投稿
$('#postTask').on('click', function () {
  ipc.send('post-task',
    $('#taskName').val(),
    $('#taskDetail').val()
  );
});


// TODO 初期化処理
// TODO mainからリストを受け取って描画する

$(function () {
  var $noTask = $('<span></span>', {
    'class': 'lavel lavel-info',
    text: 'no task',
  });
  $('#tasks').append($noTask);
});
