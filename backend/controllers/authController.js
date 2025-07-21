
import bcrypt from "bcrypt"
import generateToken from "../utils/generateToken"
import User from "../db/models/user"
import redisClient from "../config/redis";


export const signup  =  async(req,res) => {
    try{
     const {name,email,password}=req.body;

     const isExistingUser = User.findOne({email:email});

     if(isExistingUser){
        res.send({status:false,message:"User already exists"});
     }

     const salt= await bcrypt.genSalt(10);
     const encryptedPassword=await bcrypt.hash(password,salt);

     const user = {name:name,email:email,password:encryptedPassword};
     User.create(user);
     
     const response={
        status: true,
        message:"signup successfull"
     }
     return res.status(200).json(response);

    }
    catch(err){
        const response={
            status: false,
            message:"Login failed",
            error:err.message || err
        }
        return res.status(500).json(response);
    }     
}

export const login =  async(req,res) => {
    try{
     const {email,password}=req.body;
     
     const user = await  User.find({
        where:{
            email:email
        }
     })
     if(!user){
         const response={
            status:false,
            message:"User not found"
        }
        return res.status(420).json(response);
     }
    
     const isMatch= await bcrypt.compare(password,user.password)
     if(!isMatch){
          const response={
            status:false,
            message:"Invalid credentials"
        }
        return res.status(420).json(response);
     }

     const token = generateToken(user._id,user.roleId,res);

     //cache user data in redis for 1 hr

     await redisClient.setEx(`user:${user._id}`,3600,JSON.stringify(user));

     const response={
        status: true,
        message:"Login successfull",
        token:token
     }
     return res.status(200).json(response);

    }
    catch(err){
        const response={
            status: false,
            message:"Login failed",
            error:err.message || err
        }
        return res.status(500).json(response);
    }

}

export const logout=async(req,res) => {
    try{
       res.clearCookie("token",
        {
            httpOnly: true,
      sameSite: "Strict",
      secure: process.env.ENVIRONMENT === "PRODUCTION",
        }
       );

       return res.status(200).json({status:true,message:"Logged out sucessfully"});
    }
    catch(err){
      return res.status(500).json({status:true,message:"Loggout failed",error:err.message || err});
    }
}

