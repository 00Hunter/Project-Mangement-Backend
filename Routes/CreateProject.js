const express=require('express')
const route=express.Router();
const pool=require('../pool')
const ProjectAuth=require('../middleware/auth')
var format = require('pg-format');



route.get('/getAll',async(req,res)=>{
    if(!req.body){
        res.status(400).send("Invalid request");
        return ;
    }

    const client = await pool.connect();
    // console.log(req.query)
    const {User_id}=req.query;
    // console.log(User_id)
    const query='SELECT Project_id FROM UPR WHERE User_id=$1'

    try{
        const project_ids=await client.query(query,[User_id]);
        let array=[];
        project_ids.rows.map((item)=>{
            array.push(item.project_id);
        })
       
        const query1 = 'SELECT * FROM PROJECTS WHERE project_id = ANY($1::int[])';
        const result = await pool.query(query1, [array]);
        // console.log(result.rows);
        res.status(200).send(result.rows)
        return;
        // res.send(array);
        }catch(e){
        console.log(e);
        }
})

route.post('/', ProjectAuth,async (req, res) => {
    if(!req.body){
        res.status(400).send("Invalid request");
        return ;
    }

    

    console.log(req.body)
    const client = await pool.connect();
    try {
        const { ProjectName, DueDate, Time, DateCreated, DateUpdated, Tags, User_id } = req.body;

        // Insert into PROJECTS table
        await client.query("BEGIN");
        const insertQuery = "INSERT INTO PROJECTS(ProjectName, DueDate, Time, DateCreated, DateUpdated, Tag) VALUES ($1, $2, $3, $4, $5, $6) RETURNING Project_id";
        const result = await client.query(insertQuery, [ProjectName, DueDate, Time, DateCreated, DateUpdated, Tags]);
        // console.log(result)
        if (result.rows.length === 0) {
            throw new Error("Insert failed, no rows returned");
        }

        const project_id = result.rows[0].project_id;

        // Insert into UPR table
        const temp = [User_id, project_id];
        // console.log(temp)
        const q1 = "INSERT INTO UPR (USER_ID, PROJECT_ID) VALUES ($1, $2)";
        const ress=await client.query(q1, temp);
        console.log({project_id})

        await client.query('COMMIT');
        res.status(200).send({ project_id });
    } catch (e) {
        await client.query('ROLLBACK');
        console.error(e);
        res.status(500).send("An error occurred");
    } finally {
        client.release();
        return

    }
});




module.exports =route