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

  // 全クリア
  // FIXME: 差分更新
  $('#tasks').html('');
  $('#root').html('');

  // Storageがからの時だけ、#rootにpost-groupテンプレートを挿入
  if ( tasks.length == 0 ) {
    var $postGroupForm = $('#template div.post-group').clone();
    $('div#root').append($postGroupForm);
    $('div#root #postGroup').on('click', function () { postGroup('root') });
  } else {
    // 再帰的描画
    procRenderItem($('#tasks'), tasks[0], 'group0');
  }
});

// 再帰的に、タスクなのかgroupなのかわからない連中を描画する
// TODO 再帰呼び出し回数に制限を設ける
function procRenderItem($current, item, groupId) {
  console.log('render type:' + item.type);
  // for example
  //
  //
  // group0    <-- groupId
  //   task
  //   task
  //   group0-0 <-- item
  //     task
  //     task
  //     group0-0-0
  //     group0-0-1
  //   group0-1
  //   task...
  //
  //   and so on

  // タスクの場合
  //     カレントにタスクを追加して終了
  // グループの場合
  //     カレントにグループを追加して、
  //     tasksの各要素に再帰呼び出しして、
  //     グループフォームを追加して、
  //     タスクフォームを追加して、
  //     終了
  // 
  switch(item.type) {
    case 'task':
      $current.append(TAG.item(item.name, item.detail));
      break;
    case 'group':
      console.log('       gid :' + item.groupId);
      $current.append(TAG.panel(item.title, item.groupId));
      $.each(item.tasks, function () {
        // 再帰呼び出し
        procRenderItem($('div#' + item.groupId + ' div.panel-body'), this, item.groupId);
      });
      // グループフォームを表示
      var $postGroupForm = $('#template div.post-group').clone();
      $('#tasks div#' + item.groupId + ' div.panel-body').append($postGroupForm);
      $('div#'+ item.groupId +' #postGroup').unbind();
      $('div#'+ item.groupId +' #postGroup').on('click', function () { postGroup(item.groupId) });
      // タスクフォームを表示
      var $postTaskForm = $('#template div.post-task').clone();
      $('#tasks div#' + item.groupId + ' div.panel-body').append($postTaskForm);
      $('div#'+ item.groupId +' #postTask').unbind();
      $('div#'+ item.groupId +' #postTask').on('click', function () { postTask(item.groupId) });
      break;
  }
}

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

function postGroup(groupId) {
  // 最初のグループの場合、groupIdはrootになる
  ipc.send('post-group',
      groupId,
      $('div#' + groupId + ' #groupName').val()
  );
  $('div#' + groupId + ' #groupName').val('');
}

// 投稿

function postTask(groupId) {
  ipc.send('post-task',
    groupId,
    $('div#' + groupId + ' #taskName').val(),
    $('div#' + groupId + ' #taskDetail').val()
  );
  $('div#' + groupId + ' #taskName').val('');
  $('div#' + groupId + ' #taskDetail').val('');
};


// TODO 初期化処理
// TODO mainからリストを受け取って描画する

$(function () {
  ipc.emit('refresh', []);
});

//-------------------------------------------------
//
//              DOM handler
//
//-------------------------------------------------

var TAG = {};

TAG.panel = function (title, groupId) {
  var panel   = TAG.newDom('<div class="panel panel-primary" id="' + groupId + '">', '', '</div>');
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
