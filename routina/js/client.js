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
  $.each(tasks, function () {
    switch(this.type) {
      case 'task':
        // TODO タスクはグループに属する
        console.log('ignore root task');
        break;
      case 'group':
        $('#tasks').append(TAG.panel(this.title));
        // TODO グループのタスクをリスト表示
        break;
    }
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

// グループ作成
$('#postGroup').on('click', function () {
  ipc.send('post-group', $('#groupName').val());
  $('#groupName').val('');
});

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

TAG.panel = function (title) {
  var panel   = TAG.newDom('<div class="panel panel-primary">', '', '</div>');
  var heading = TAG.newDom('<div class="panel-heading">', '', '</div>');
  var body    = TAG.newDom('<div class="panel-body">', '', '</div>');
  var title   = TAG.newDom('<h3 class="panel-title">', title, '</h3>');
      heading.append(title)
      panel.append(heading);
      panel.append(body);
  return panel;
};


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
