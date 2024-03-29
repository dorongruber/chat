const mongoose = require('mongoose');

module.exports = mongoose.connect(process.env.DEV_DB_CONNECTION || process.env.PRO_BD_CONNECTION,
{useNewUrlParser: true, useUnifiedTopology: true,  autoIndex: false }).then(() => {
  console.log('connected to db');
}).catch((err) => {
  console.log('connection failed -> ', err);
})
