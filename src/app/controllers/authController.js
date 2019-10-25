const express = require('express')

const User = require('../models/user')

const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')

const authConfig = require('../../config/auth')

const crypto = require('crypto')

const mailer = require('../../modules/mailer')

const router = express.Router();


// funcção para gerar o token, tanto para o login quanto para o register
        function generateToken(params = {}){
            return jwt.sign(params, authConfig.secret, { expiresIn : 86400 } ) 
        }


router.post('/register', async (req,res) =>{
try {
const { email } = req.body

    if (await User.findOne({email})) {
      return res.status(400).send( {error : 'Erro, o Email ja foi cadastrado'})
    }

    const user = await User.create(req.body);
        return res.send({user ,  token : generateToken({ id: user.id })
    });
}catch (err) {
    return res.status(400).send({ error : 'Erro ao cadastrar usuario' })
}
});

router.post('/authenticate', async (req,res) =>{
    const { email, password } = req.body

    const user = await User.findOne({ email })
        if(!user)
            return res.status(400).send({error : 'Erro, usuario não encontrado'})
        
    
        if(!await bcrypt.compare(password, user.password))
             return res.status(400).send({error : 'Senha invalida'})

    
     const token = jwt.sign({ id : user.id }, authConfig.secret, { expiresIn : 86400 } )       

    res.send({ user, token : generateToken({ id: user.id }),
    });
             
    });


router.post('/forgot_password', async (req,res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if(!user)
        return res.status(400).send({error : 'Erro, usuario não encontrado'})

        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date;
        now.setHours(now.getHours() + 1);

        await User.findByIdAndUpdate(user.id, {
            '$set' : {
                passwordResetToken : token,
                passwordResetExpires : now
            }
        })


        mailer.sendMail({
            from: 'UNC@server.com',
            to: 'user@email.com',
            subject: 'Mensagem de recuperação de senha',
             text: 'Recupere sua senha',
             html: '<p>Ok, utilize o token a seguir para resetar a senha</p>' + token
        }, (err) => {
            if (err)
                return res.status(400).send({error : 'Erro ao enviar email'});
        });

        res.send({ok : true});

    } catch (err) {
        console.log(err);
        
        return res.status(400).send({error : 'Erro ao solicitar nova senha'})
    }
});

router.post('/reset_password', async (req,res) => {
    const {email, token, password} = req.body;

    try {
        const user = await User.findOne({ email }).select('+passwordResetToken passwordResetExpires');

        if(!user)
        return res.status(400).send({error : 'Erro, usuario não encontrado'})


        if(token !== user.passwordResetToken)
            return res.status(400).send({ error : 'Os tokens não conferem' })

            const now =  new Date();

            if(now > user.passwordResetExpires)
                res.status(400).send({error : 'O token expirado, tente novamente'})
            
        
        user.password = password;
        
        await user.save();

        //so pra ve o estoro
        res.send('Ok, senha resetada')



    } catch (err) {
        return res.status(400).send({error : 'Erro ao resetar a senha'})
    }



});

module.exports = app => app.use('/auth', router)