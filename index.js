const express=require('express');
const app=express();
const hello=require('./Routes/hello')
const Task=require('./Routes/CreateTaskRoute');
const bodyParser = require('body-parser');
const Project=require('./Routes/CreateProject');
const User=require('./Routes/CreateUser')
const ProjectToTask=require('./Routes/ProjectToTask')
const cors = require('cors'); // Import the cors middleware



app.use(bodyParser.json());
app.use(cors());

app.use('/api/hello',hello);
app.use('/api/Task',Task)
app.use('/api/project',Project)
app.use('/api/User',User)
app.use('/api/PTR',ProjectToTask)



const port=process.env.PORT||3000;
app.listen(port,()=>{console.log(`Listining to port${port}`)})