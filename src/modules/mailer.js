const path = require('path')
const nodemailer = require('nodemailer')
const hbs =  require('nodemailer-express-handlebars')

//se necessario criar arquivo json para salvar configurções do transport

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "5567362eedabd5",
    pass: "b45c7ccce24a3c"
  }
});

 
  module.exports = transport;