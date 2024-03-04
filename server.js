const express = require("express");
const connectDb = require("./config/db.connect");
const dotenv = require("dotenv").config();

connectDb()

const port = process.env.PORT || 5000;
const app = express()

app.use(express.json());
app.use("/api/users", require("./routes/user.routes.js"))

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
})