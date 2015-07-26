var ipc = require('ipc');

console.log('client.js loaded');

$('#postTask').on('click', function () {
  ipc.send('post-task',
    $('#taskName').val(),
    $('#taskDetail').val()
  );
});
