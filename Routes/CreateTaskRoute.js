const express=require('express')
const route=express.Router();
const pool=require('../pool')
var format = require('pg-format');
const { status } = require('express/lib/response');

route.get('/getAll',async(req,res)=>{
    if(!req.query){
        res.status(400).send("Invalid request");
        return ;
    }
    const {Project_id}=req.query;
    console.log(Project_id)
    const query='SELECT * FROM Task WHERE project_id=$1';

    try{
        const tasks=await pool.query(query,[Project_id]);
        console.log(tasks);
        res.send(tasks.rows);
    }catch(e){
        console.log(e)
    }
})

route.put('/',async(req,res)=>{
    if(!req.body){
        res.status(400).send("Invalid request");
        return ;
    }
    console.log(req.body)
    const task_id=req.body[0];

        const query = 'UPDATE task SET status = $1 WHERE task_id = $2';
        const values = [1, task_id];
    
        try {
            const result = await pool.query(query, values);
            res.status(200).send();
            console.log('Task updated:', result.rowCount); // res.rowCount will be 1 if the task was updated
        } catch (err) {
            console.log(err);
        }
})
route.post('/',async(req,res)=>{
    console.log(req.body)
    if(!req.body){
        res.status(400).send("Invalid request");
        return ;
    }

    
    const client = await pool.connect();

    const{project_id}=req.body[0];
    // console.log(req.body)
    const array=[];
    const r=['Name',1,'00:00:00'];

   let arr= req.body.map((row)=>{array.push(Object.values(row))});
  
    //  console.log(array)
    const query = format('INSERT INTO TASK(Task_Name, Status, TimeCreated,project_id) VALUES %L RETURNING task_id' , array);
    // const query = `INSERT INTO TASK(Task_Name, Status, TimeCreated,project_id) VALUES %L RETURNING task_id`; // Using RETURNING clause to get the generated Task_id
    // const query = format('INSERT INTO TASK (Task_Name, Status, TimeCreated) VALUES %L RETURNING task_id', array);

    //using transactions to perform ptr relationship
    try {
        await client.query("BEGIN") //start transaction 
        const q1=await client.query(query) //insert in one table 
            

         let a=[project_id,q1.rows[0].task_id];//getting the returned task_ids;
            console.log(a);
        const ptr_query=('INSERT INTO PTR (project_id,Task_id) VALUES ($1,$2) ') //performing the second insertion
        const ptr=await client.query(ptr_query,a) 
        // console.log(ptr)
        await client.query("COMMIT");//commit the changes
        console.log(ptr);      
       
        res.send({
            status:200,
            data:q1.rows[0].task_id})
    } catch (err) {
        console.log(err)
        await client.query("ROLLBACK")
        throw err;
    }finally{
        client.release();
        return;
    }
    
})


route.delete('/',async(req,res)=>{
    if(!req.body){
        res.status(400).send("Invalid request");
        return ;
    }

    const {task_id}=req.body;

    const query = 'DELETE FROM task WHERE task_id = $1';
    const values = [task_id];

    try {
        const result = await pool.query(query, values);
        console.log('Task deleted:', result.rowCount); // rowCount will be the number of rows deleted
        res.status(200).send();
    } catch (err) {
        console.error(err.stack);
    }

})



module.exports =route