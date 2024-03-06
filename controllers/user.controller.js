const asyncHandler = require("express-async-handler");
const User = require("../models/user.model.js")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const registerUser = asyncHandler(async(req,res)=>{
    const {username, email, password} = req.body
    if(!username || !email || !password){
    res.status(400)    
    throw new Error("All fields are required")
}

const existedUser = await User.findOne({
    $or:[{username},{email}]
})

if(existedUser){
    res.status(409)
    throw new Error("user with email or username already exists")
}

const hashedPassword = await bcrypt.hash(password,10);
const user = await User.create({
    username,
    email,
    password: hashedPassword,
})
if(user){
    res.status(201).json({
        _id:user.id,
        email:user.email,
        message: "Register the user"
    })
}else{
    res.status(509)
    throw new Error("something went wrong while register the user")
}
})

const loginUser = asyncHandler(async(req,res) => {
    const {email,password} = req.body;
    if(!email || !password){
        res.status(400)
        throw new Error("All fields are mandotory!")
    }
    const user = await User.findOne({email});
    // compare password with hashedPassword
    if(user && (await bcrypt.compare(password, user.password))){
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user.id
            }
        },process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "30m"}
        );
        res.status(200).cookie("accesstoken",accessToken,{
            httpOnly:true,
        }).json({
            message:"successfully login",accessToken
        });
    }else{
        res.status(401)
        throw new Error("All fields are mandotory!")
    }
});

const currentUserInfo = asyncHandler(async(req,res) => {
    res.json(req.user);
});

module.exports = {
    registerUser,
    loginUser,
    currentUserInfo
}


