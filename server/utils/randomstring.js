module.exports.makeId = function makeId(length) {
  let res = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for(let i=0; i< length; i++) {
    res += characters.charAt(Math.floor(Math.random()* charactersLength));
  }
  return res;
}
