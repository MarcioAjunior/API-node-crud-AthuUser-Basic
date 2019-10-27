const mongoose = require('../../database')


const projectSchema = new mongoose.Schema({
    title : {type : String, required : true},
    description : {type : String, required : true},
    //referenciando
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        require : true
    },

    //array, [], pois pode ter varias task no projeto
    tasks : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Task'
    }],
    createdAt : { type:  Date, default: Date.now }
});


const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
 