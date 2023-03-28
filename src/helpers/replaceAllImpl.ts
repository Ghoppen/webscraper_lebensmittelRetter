String.prototype.replaceAll = function (
  this: string,
  stringToChange: string,
  changedString: string
): string {
  var str = this;
  str = str.split(stringToChange).join(changedString);
  return str;
};
