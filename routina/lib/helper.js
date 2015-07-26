// original helper
var Helper = function () {
};

Helper.prototype.setCurrentDirectory = function (cd) {
  this.cd = cd;
};

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
