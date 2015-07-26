'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');
var Menu = require('menu');

require('crash-reporter').start();

// ---------------------------------------------------------
// original helper
var Helper = {};

Helper.url = function (path, onlyPath) {
  var filepath = path;
  if (path instanceof Array) { filepath = path.join('/'); }

  if (onlyPath) { return __dirname + '/' + filepath; }
  return 'file://' + __dirname + '/' + filepath;
};

Helper.filepath = function (path) {
  return Helper.url(path, true);
};

// ---------------------------------------------------------


// avoid GC
var mainWindow = null;

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
