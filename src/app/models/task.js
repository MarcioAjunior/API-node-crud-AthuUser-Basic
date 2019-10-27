const mongoose = require('../../database')


const taskSchema = new mongoose.Schema({
    title : {type : String, required : true},

    project : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Project',
        require : true
    },
    //Usuario a quem a tarefa foi atribuida
    assingnedTo : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        require : true
    },
    completed : { type : Boolean, default : false, require : true},

    createdAt : { type:  Date, default: Date.now }
});


const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
 