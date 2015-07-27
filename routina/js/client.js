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
    $('#tasks .list-group').append(TAG.item(this.name, this.detail));
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
  $('#tasks').text('(no task)');
});

//-------------------------------------------------
//
//              DOM handler
//
//-------------------------------------------------

var TAG = {};
TAG.list = function (text) { return TAG.newDom('<div class="list-group">', text, '</div>'); };
TAG.item = function (name, detail) {
  var item = TAG.newDom('<a href="#" class="list-group-item">', '','</a>');
      item.append(TAG.newDom('<h4 class="list-group-item-heading">', name, '</h4>'));
      item.append(TAG.newDom('<p class="list-group-item-text">', detail, '</p>'));
  return item;
};

TAG.newDom = function (head, text, foot) {
  if (!text) { text = ''; }
  return $(head + text + foot);
};
