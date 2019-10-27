const express = require('express')
const authMiddleware = require('../middleware/auth');
const router = express.Router();

const Project = require('../models/project')//model de projeto
const Task = require('../models/task')//model de tarefas

//sempre que defino isso aqui, digo que a rota ira passar pela middleware
router.use(authMiddleware)



//GET
router.get('/', async (req, res) => {

    try {
        const projects = await Project.find().populate(['user', 'tasks']);
        // o .populate traz todos os atributos do usuario pelo ID de quando foi cadastrado  

        return res.send({ projects }); //user : req.userId -> passando o usuario  
    } catch (error) {
        return res.status(400).send({ error: 'Erro ao procurar por projetos' })
    }


});

//GETbyId
router.get('/:projectId', async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId).populate(['user', 'tasks']);
        // o .populate traz todos os atributos do usuario pelo ID de quando foi cadastrado  

        return res.send({ project }); //user : req.userId -> passando o usuario  
    } catch (error) {
        return res.status(400).send({ error: 'Erro ao procurar por projetos' })
    }
});

//Post
router.post('/', async (req, res) => {
    try {
        const { title, description, tasks } = req.body

        let usuario = req.userId;


        const project = await Project.create({ title, description, user: usuario });

        await Promise.all(tasks.map(async task => {
            const projectTask = new Task({ ...task, project: project._id });
            projectTask.save();
            // Juro que não sei, mas a tasks existem no documento project
            await project.tasks.push(projectTask)

        }));

        await project.save();

        return res.send({ project })
    } catch {
        return res.status(400).send({ error: 'Erro ao cadastrar o novo projeto' })
    }

});




//Put
router.put('/:projectId', async (req, res) => {
    try {
        const { title, description, tasks } = req.body

        const project = await Project.findByIdAndUpdate(req.params.projectId, { title, description }, { new: true });

        //apagando as tasks e criando novamente para atualizar todas
        project.tasks = [];
        await Task.remove({ proeject: project._id })

        await Promise.all(tasks.map(async task => {
            const projectTask = new Task({ ...task, project: project._id });
            projectTask.save();
            // Juro que não sei, mas a tasks existem no documento project
            await project.tasks.push(projectTask)

        }));

        await project.save();

        return res.send({ project })
    } catch (err) {
        console.log(err);

        return res.status(400).send({ error: 'Erro ao atualzar o projeto' })
    }
});



//delete
router.delete('/:projectId', async (req, res) => {
    try {
        const project = await Project.findOneAndRemove(req.params.projectId).populate('user');
        // o .populate traz todos os atributos do usuario pelo ID de quando foi cadastrado  

        return res.send('O projeto foi excluido com sucesso'); //user : req.userId -> passando o usuario  
    } catch (error) {
        return res.status(400).send({ error: 'Erro ao procurar pelo projeto' })
    }
});


module.exports = app => app.use('/projects', router)