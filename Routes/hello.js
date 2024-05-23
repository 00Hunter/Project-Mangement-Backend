const express=require('express')
const route=express.Router();


route.get('/',async(req,res)=>{
    //validate request
    const hello="HEELLOO WORLD"
    res.send(hello)
})

module.exports=route