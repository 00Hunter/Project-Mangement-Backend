const express=require('express')
const route=express.Router();
const pool=require('../pool')
var format = require('pg-format');

route.post('/',async(req,res)=>{
    const projectid=req.body.Project_id;
    
    const taskid=JSON.parse(req.body.Task_id);
    const array=[];

    for(let i=0;i<taskid.length;i++){
        const temp=[];
        temp.push(projectid);
        temp.push(JSON.stringify(taskid[i]));
        array.push(temp);
        // console.log(taskid[i]);
    }
    console.log(array)
    //[[task_id,Project_id],[101,1],[102,1],[103,1]]
    const query = "INSERT INTO PTR(Project_id, Task_id) VALUES %L"; // Using RETURNING clause to get the generated Task_id
    
    try {
        const result = await pool.query(format(query, array),[],(err,response)=>{
            console.log(response);
            console.log(err)
        }); // Executing the query using await   
        console.log(result)
        
    } catch (err) {
       console.log(err)
    }
    res.status(200).send()
})

module.exports =route