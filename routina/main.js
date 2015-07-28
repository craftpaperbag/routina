'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');
var Menu = require('menu');
var ipc = require('ipc');

var Helper = require('./lib/helper');
Helper.setCurrentDirectory(__dirname);

require('crash-reporter').start();

// ---------------------------------------------------------

// avoid GC
var mainWindow = null;
// TODO いけてないのでなんとかする
var Storage = [];
Helper.setStorage(Storage);

app.on('window-all-closed', function () {
  console.log('all window closed');
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// ---------------------------------------------------------

// menu
var menu = Menu.buildFromTemplate([
  {
    label: 'Routina',
    submenu: [
      {label: 'Debug', accelerator: 'Command+D', click: function () { mainWindow.openDevTools(); }},
      {type: 'separator'},
      {label: 'Quit', accelerator: 'Command+Q', click: function () { app.quit(); }}
    ]
  },
]);


app.on('ready', function (){
  Menu.setApplicationMenu(menu);

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });
  mainWindow.loadUrl(Helper.url('index.html'));

  mainWindow.on('closed', function () {
    console.log('main window closed');
    mainWindow = null;
  });
});
// ---------------------------------------------------------
// IPC

ipc.on('post-task', function (event, groupId, name, detail) {
  console.log('post-task received.');
  console.log(groupId + ':' + name + ':' + detail);

  // groupIdからインデックスを取得
  var index = Number(groupId.match(/[0-9]+/));
  console.log('group index: ' + index);

  // タスクをストレージに追加
  Storage[index].tasks.push({type: 'task', name: name, detail: detail});

  // レンダラ側でリフレッシュ
  event.sender.send('refresh', Storage);
});

// 注意：groupIdは作成時に割り当てる。
// クライアントは関与できない
ipc.on('post-group', function (event, groupId, title) {
  console.log('post-group received.');

  // 名付けをする。
  var newGroupId = '';
  if (groupId == 'root') {
    newGroupId = 'group0'
    // 最初のグループをストレージに追加
    Storage.push({
      type: 'group',
      groupId: newGroupId,
      title: title,
      tasks: []
    });
  } else {
    // グループを探す
    // TODO 重複した処理
    var group = Helper.findGroup(groupId);
    var gi = Helper.childGroups(groupId).length;
    newGroupId = groupId + '-' + gi;
    console.log('newGroupId: ' + newGroupId);
    // グループをストレージに追加
    group.tasks.push({
      type: 'group',
      groupId: newGroupId,
      title: title,
      tasks: []
    });
  }


  // レンダラ側でリフレッシュ
  event.sender.send('refresh', Storage);
});
