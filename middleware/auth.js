function ProjectAuth(req,res,next){
    const { ProjectName, DueDate, Time, DateCreated, DateUpdated, Tags, User_id }=req.body;

    if(User_id==='' || ProjectName==='' || DueDate===''||DateCreated===''||Tags===''||Time===''){
        res.status(400).send("Bad request");
    }
    next();

}
module.exports=ProjectAuth;
