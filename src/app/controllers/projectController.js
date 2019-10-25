const express = require('express')
const authMiddleware = require('../middleware/auth');
const router = express.Router();

//sempre que defino isso aqui, digo que a rota ira passar pela middleware
router.use(authMiddleware)

router.get('/', (req,res) => {
    res.send({ok : true, user : req.userId}); //user : req.userId -> passando o usuario 
});

module.exports = app => app.use('/projects', router)