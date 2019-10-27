const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth')


module.exports = (req,res,next) =>{
    const authHeader = req.headers.authorization;

    if(!authHeader)
        return res.status(401).send({error : 'Token não informado'})


 
jwt.verify(authHeader, authConfig.secret, (err, decoded) =>{
    if(err) return res.status(401).send({ error : 'Token invalido' })

    
    req.userId = decoded.id;

    return next();

});


};