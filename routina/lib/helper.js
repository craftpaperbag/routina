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

Helper.prototype.findGroup = function (gid) {
  var gida = gid.replace('group', '').split('-');
  var pointer = this.Storage;
  var found = null;
  for (var i = 0; i < gida.length; i++) {
    console.log('search:'+i);
    var counter = -1;
    for (var j = 0; j < pointer.length; j++) {
      //    group0-1-2
      // => group 0 - 1 - 2
      // => [0,1,2]
      console.log('  type: '+ pointer[j].type);
      console.log('    counter: '+ counter);
      if (pointer[j].type == 'group') {
        counter ++;
        console.log('    counter up: '+ counter);
        console.log('    gida: '+ gida[i]);
        if (counter == gida[i]) {
          console.log('      found group:' + pointer[j].groupId);
          found = pointer[j];
          pointer = pointer[j].tasks;
          break;
        }
      }
    }
  }

  return found;
};

Helper.prototype.childGroups = function (gid) {
  var found = this.findGroup(gid);

  // groupを見つけたか？
  if ( found !== null ) {
    var childGroups = [];
    var pointer = found.tasks;
    for (var i = 0; i < pointer.length; i ++ ) {
      if (pointer[i].type == 'group') {
        console.log('childGroups: child '+i);
        childGroups.push(pointer[i]);
      }
    }
    return childGroups
  } else {
    console.error('childGroups: group not found(gid='+gid+', found='+found+')');
    return [];
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
