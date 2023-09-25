const {BlackListModel} = require("../models/blacklisting.model");
const jwt = require("jsonwebtoken");

const auth = async(req, res, next) =>{
    const token = req.headers.authorization;
    try {
        let existingToken = await BlackListModel.find({
            blacklist : {$in : token},
        });
        if(existingToken.length > 0){
            res.status(200).json({msg : "Please Login!!!"});
        }else{
            const decoded = jwt.verify(token, "masai");
            req.body.userID = decoded.userID;
            req.body.username = decoded.username;
            next();
        }
    } catch (error) {
        res.status(400).json({error : error});
    }
}

module.exports={
    auth
}