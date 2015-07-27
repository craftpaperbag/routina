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
  $('#tasks').append(TAG.list);
  $.each(tasks, function () {
    var task = this.name + ': ' + this.detail;
    $('#tasks ul').append(TAG.item(task));
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
  $('#taskName').val('');
  $('#taskDetail').val('');
});


// TODO 初期化処理
// TODO mainからリストを受け取って描画する

$(function () {
  $('#tasks').append(TAG.list());
  $('#tasks ul').append(TAG.item('(no tasks)'));
});

//-------------------------------------------------
//
//              DOM handler
//
//-------------------------------------------------

var TAG = {};
TAG.list = function (text) { return TAG.newDom('<ul class="list-group">', text, '</ul>'); };
TAG.item = function (text) { return TAG.newDom('<li class="list-group-item">', text, '</li>'); };

TAG.newDom = function (head, text, foot) {
  if (!text) { text = ''; }
  return $(head + text + foot);
};
