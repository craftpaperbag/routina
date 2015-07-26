var ipc = require('ipc');

$('#taskForm').on('submit', function () {
  ipc.send('post-task',
    $('#taskName').val(),
    $('#taskDetail').val()
  );
});
