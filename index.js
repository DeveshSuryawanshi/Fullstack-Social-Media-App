const express = require("express");
const cors = require("cors");
const {connection} = require("./db");
const {userRouter} = require("./Routes/user.routes");
const {postRouter} = require("./Routes/post.routes");
const {auth} = require("./Middleware/auth.middleware");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", async(req, res) =>{
    res.setHeader("Content-type", "text/html");
    res.send("<h1> Welcome to the Server</h1>");
})

app.use("/users", userRouter);
app.use("/posts", auth, postRouter);

app.listen(8080, async() =>{
    try {
        await connection;
        console.log("Connected to the DataBase");
        console.log("Server is Runing on port 8080");
    } catch (error) {
        console.log(error);
    }
})