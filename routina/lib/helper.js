// original helper
var Helper = function () {
};

Helper.prototype.setCurrentDirectory = function (cd) {
  this.cd = cd;
};
Helper.prototype.setStorage = function (s) {
  this.Storage = s;
};

//--------------------------------------------
// for storage

Helper.prototype.childGroups = function (gid) {
  var gida = gid.sub('group').split('-');
  
  var pointer = this.Storage;
  var found = null;
  for (var i = 0; i < gida.length; i++) {
    var counter = -1;
    for (var j = 0; j < pointer.length; j++) {
      //    group0-1-2
      // => group 0 - 1 - 2
      // => [0,1,2]
      if (pointer[j].type == 'group') {
        counter ++;
        if (counter == gida[i]) {
          found = pointer[j];
          pointer = pointer[j].tasks;
          break;
        }
      }
    }
  }

  // groupを見つけたか？
  if ( !!found && found.groupId == gid ) {
    var childGroups = [];
    for (var i = 0; i < pointer.length; i ++ ) {
      if (pointer[i].type == 'group') {
        console.log('childGroups: child '+i);
        childGroups.push(pointer[i]);
      }
    }
    return childGroups
  } else {
    console.error('childGroups: group not found(gid='+gid+')');
    return -1;
  }

};

//--------------------------------------------
// for url

Helper.prototype.url = function (path, onlyPath) {
  var filepath = path;
  if (path instanceof Array) { filepath = path.join('/'); }

  if (onlyPath) { return this.cd + '/' + filepath; }
  return 'file://' + this.cd + '/' + filepath;
};

Helper.prototype.filepath = function (path) {
  return this.url(path, true);
};

module.exports = new Helper();
