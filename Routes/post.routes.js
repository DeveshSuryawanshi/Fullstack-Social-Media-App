const express = require("express");
const {PostModel} = require("../models/post.model");

const postRouter = express.Router();

postRouter.get("/", async(req, res) =>{
    console.log(req.body);
    const {device1, device2} = req.query;
    const {userID} = req.body;
    const Query={};
    if(userID){
        Query.userID = userID;
    }
    if(device1 && device2){
        Query.device = {$and : [{device : device1}, {device : device2}]};
    }else if(device1){
        Query.device = device1
    }

    try{
        const posts = await PostModel.find(Query)
        res.status(200).json({msg : "User Posts", posts});
    }catch(error){
        res.status(400).json({error:error});
    }
})

postRouter.post("/add", async(req, res) =>{
    const {userID} = req.body;
    try {
        const post = new PostModel({...req.body, userID});
        await post.save();
        res.status(200).json({msg : "Post added Successfully"});
    } catch (error) {
        res.status(400).json({error: error});
    }
});

postRouter.patch("/update/:id", async(req, res) =>{
    const {id} = req.params;
    const {userID} = req.body;
    try{
        const post = await PostModel.findByIdAndUpdate({userID, _id : id}, req.body);
        if(!post){
            res.status(400).json({msg : "Post not found"});
        }else{
            res.status(200).json({msg : "Post Updated"});
        }
    }catch(error){
        res.status(400).json({error: error});
    }
})

postRouter.delete("/delete/:id", async(req, res) =>{
    const {id} = req.params;
    const {userID} = req.body;
    try{
        const post = await PostModel.findByIdAndDelete({userID, _id : id});
        if(!post){
            res.status(400).json({msg : "Post not found"});
        }else{
            res.status(200).json({msg : "Post Deleted"});
        }
    }catch(error){
        res.status(400).json({error: error});
    }
})



module.exports = {
    postRouter
}