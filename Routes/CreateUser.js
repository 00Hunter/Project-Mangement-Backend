const express=require('express')
const route=express.Router();
const pool=require('../pool')
var format = require('pg-format');


route.post('/auth',async(req,res)=>{
    if(!req.body){
        res.status(400).send("Invalid request");
        return ;
    }
    // console.log(req)
    const {email,password}=req.body;

    try{
        const result=await pool.query('SELECT EMAIL FROM USERS WHERE EMAIL=$1',[email]);
        if(result.rowCount===0){
            res.send("Invaild Email or password");
            return;
        }

    const pass=await pool.query('SELECT PASSWORD FROM USERS WHERE PASSWORD=$1',[password]);
    if(pass.rowCount===0){
        res.send("Invaild Email or password");
        // return
    }
    const user=await pool.query('SELECT USER_ID FROM USERS WHERE EMAIL=$1 AND PASSWORD=$2',[email,password]);
    console.log(user.rows);
    res.send(user.rows[0])
    // return 
    
    }catch(e){
        res.send("Dont try again ")
    }
    
    
});

route.post('/',async(req,res)=>{
    console.log(req.body);
    if(!req.body){
        res.status(400).send("Invalid request");
        return ;
    }
    const array=req.body;

    
    console.log(array);
    const query = "INSERT INTO USERS(Name,Email,Password,Mobile) VALUES ($1,$2,$3,$4) RETURNING User_id"; // Using RETURNING clause to get the generated Task_id
    
    try {
        const result = await pool.query(query,array); // Executing the query using await   
        // var taskId = result.rows[0].task_id;
        console.log(result.rows[0])

        res.send(result.rows)
        // return
    } catch (err) {
       console.log(err)
    }
    
})

module.exports =route