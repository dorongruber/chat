const mongoose = require('mongoose');

module.exports = mongoose.connect('mongodb+srv://doron:QAWSed123321@dgcluster.xqngn.mongodb.net/chatProject',
{useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
  console.log('connected to db');
}).catch((err) => {
  console.log('connection failed -> ', err);
})
