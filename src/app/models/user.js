const mongoose = require('../../database')
const bcrypt = require('bcryptjs')


const userSchema = new mongoose.Schema({
    name : {type : String, required : true},
    email : { type : String, required : true, lowercase : true, unique : true },
    password : {type: String, required : true},
    passwordResetToken : {type: String, select : false},
    passwordResetExpires : { type: Date, select : false },
    createdAt : { type:  Date, default: Date.now }
});

//encriptando a senha antes de salvar
//erro devido ao fato de não poder usar arrow function, pois é inpossivel recuperar o this na arrow function
userSchema.pre('save', async function(next) {
const hash = await bcrypt.hash(this.password, 10);
this.password = hash;

next();

});

const User = mongoose.model('User', userSchema);

module.exports = User;
