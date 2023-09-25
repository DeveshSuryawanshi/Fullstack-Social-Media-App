const express = require("express");
const {UserModel} = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {BlackListModel} = require("../models/blacklisting.model");

const userRouter = express.Router();

userRouter.post("/register", async(req, res) =>{
    const {email,password,name,gender} = req.body;
    try {
        const user = await UserModel.findOne({email});
        if(user){
            res.status(400).json({msg : "User Already Registered"});
        }else{
            bcrypt.hash(password, 10, async(err, hash) =>{
                if(hash){
                    const NewUser = new UserModel({
                        name, 
                        password : hash,
                        email,
                        gender
                    });
                    await NewUser.save();
                    res.status(200).json({msg : "User Registred Successfully"});
                }
            })
        }
    } catch (error) {
        res.status(400).json({error : error});
    }
})

userRouter.post("/login", async(req, res) =>{
    const {email, password} = req.body;
    try {
        const user = await UserModel.findOne({email});
        if(user){
            bcrypt.compare(password, user.password, (error, result) =>{
                if(result){
                    let token = jwt.sign({userID : user._id, username : user.name}, "masai");
                    res.status(200).json({msg : "User Logged in Successfully", token});
                }else{
                    res.status(200).json({msg : "Incorrect Password"});
                }
            })
        }
    } catch (error) {
        res.status(400).json({error : error});
    }
})

userRouter.post("/logout", async(req, res) =>{
    try {
        const token = req.headers.authorization;
        if(token){
            await BlackListModel.updateMany({}, {$push : {blacklist : [token]}});
            res.status(200).json({msg : "Logout Successfully!"});
        }
    } catch (error) {
        res.status(400).json({error : error});
    }
})


module.exports={
    userRouter
}
